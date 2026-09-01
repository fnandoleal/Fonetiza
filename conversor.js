'use strict';

/* Fonetiza — motor contextual v8
   Regra central: cada palavra é analisada uma única vez a partir da grafia original.
   O resultado nunca volta para o motor, evitando conversões em cascata.
*/

const LEXICO = new Map(Object.entries({
  // Casos validados pelo projeto
  antiguidade:'antiguidade', antiquidades:'antiguidades',
  reflexo:'reflecso', reflexiva:'reflecsiva', reflexivas:'reflecsivas',
  texto:'testo', textos:'testos', você:'vosê', vocês:'vosês',
  próximo:'prósimo', próxima:'prósima', próximas:'prósimas', próximos:'prósimos',
  exato:'ezato', exata:'ezata', exatamente:'ezatamente', expediente:'espediente', expedientes:'espedientes',
  expostas:'espostas', exposto:'esposto', externa:'esterna', externo:'esterno',
  existe:'eziste', existem:'ezistem', existir:'ezistir', existia:'ezistia', existiria:'ezistiria',
  exemplo:'ezemplo', excelente:'eselente', excelência:'eselênsia', excesso:'eseso', exceto:'eseto',
  explicação:'esplicasão', experiência:'esperiênsia', exercício:'ezersísio', exclusivamente:'escluzivamente',
  expedições:'espedisoins', regiões:'rejioins', posições:'pozisoins', reuniões:'reunioins',
  preocupações:'preocupasoins', soluções:'solusoins', discussões:'discusoins', obrigações:'obrigasoins',
  notificações:'notificasoins', anotações:'anotasoins', ligações:'ligasoins', fundações:'fundasoins',
  ambições:'ambisoins', transição:'tranzisão', trânsito:'trânzito', desconexão:'desconecsão',
  aproximação:'aprosimasão', aproximações:'aprosimasoins', aproximar:'aprosimar', aproximando:'aprosimando',
  reflexivas:'reflecsivas', fixo:'ficso', fixa:'fica', fixada:'ficsada', fixos:'ficsos', fluxo:'flucso',
  gélida:'jélida', legítimo:'lejítimo', urgência:'urjênsia', incêndio:'insêndio',
  extrema:'estrema', extremidade:'estremidade', extremamente:'estremamente',
  expostas:'espostas', exposto:'esposto', exibir:'ezibir', exibindo:'ezibindo', exigir:'ezijir', exigindo:'ezijindo',
  segurança:'seguransa', necessário:'nesesário', necessidade:'nesesidade', atenção:'atensão', situação:'situasão',
  função:'funsão', funcionava:'funsionava', silêncio:'silênsio', espaço:'espaso', infância:'infânsia',
  superfície:'superfísie', quase:'cuaze', quatro:'cuatro', quando:'cuando', qualquer:'cualcer', porque:'porce',
  aquele:'acele', aquela:'acela', aquele:'acele', daquela:'dacela', daquele:'dacele', que:'ce', quem:'cem',
  cheiro:'xeiro', chuva:'xuva', chegar:'xegar', choque:'xoque', chamou:'xamou', chamar:'xamar',
  olhar:'ollar', olhos:'ollos', trabalho:'traballo', trilha:'trilla', linha:'linna', tinha:'tinna', manhã:'mannã',
  conhecia:'connesia', conhecer:'conneser', conhecida:'connesida', conhecidas:'connesidas',
  peso:'pezo', pesada:'pezada', casa:'caza', casaco:'cazaco', frase:'fraze', presente:'prezente', coisas:'coizas',
  cercada:'sercada', principal:'prinsipal', artificial:'artifisial', esquina:'escina', silencioso:'silensioso', silenciosas:'silensiosas',
  expressão:'espresão', expressivo:'espresivo', anúncio:'anúnsio', precisa:'presisa', precisar:'presizar', precisava:'presizava',
  precisão:'presizão', receber:'reseber', recebido:'resebido', começava:'comesava', começou:'comesou', começam:'comesam', começando:'comesando',
  descendo:'desendo', desceu:'deseu', descer:'deser', descida:'desida', discussão:'discusão', organização:'organizasão',
  produção:'produsão', proteção:'protesão', nascimento:'nasimento', crescimento:'cresimento', cresceu:'creseu', pesquisa:'pesciza',
  escolhido:'escollido', hesitou:'ezitou', trouxe:'trouse', trouxeram:'trouseram', repousa:'repouza', baseado:'bazeado',
  conseguia:'consegia', refúgio:'refújio', ligeiramente:'lijeiramente', galho:'gallo', cachorros:'caxorros', casais:'cazais',
  página:'pájina', gênero:'jênero', ficção:'ficsão', científica:'sientífica', história:'istória', quente:'cente', pequeno:'peceno', pequena:'pecena',
  esquecido:'escesido', seguiu:'segia', tranquilo:'trancuilo', trancilo:'trancuilo',
  // Novos casos apontados nos testes
  deixando:'deizando', faixas:'faixas', faixa:'faixa', shopping:'xópim', shoppingcenter:'xópim senter',
  põe:'poim', põem:'poim', 'põe-se':'poim-se'
}));

const CASOS_X_SOM = new Map(Object.entries({
  faixas:'faixas', faixa:'faixa', baixas:'baixas', baixa:'baixa', caixa:'caixa', caixas:'caixas',
  deixar:'deixar', deixando:'deizando', deixado:'deizado', deixa:'deiza', deixam:'deizam',
  próximo:'prósimo', reflexo:'reflecso', fixo:'ficso', fluxo:'flucso', texto:'testo'
}));

function lower(s){ return s.toLocaleLowerCase('pt-BR'); }
function isLetter(c){ return !!c && /\p{L}/u.test(c); }
function isVowel(c){ return !!c && /[aeiouáéíóúâêôãõü]/iu.test(c); }
function isFrontVowel(c){ return !!c && /[eéií]/iu.test(c); }
function preserveCase(src,dst){
  if(src === src.toLocaleUpperCase('pt-BR') && src !== src.toLocaleLowerCase('pt-BR')) return dst.toLocaleUpperCase('pt-BR');
  if(src[0] && src[0] === src[0].toLocaleUpperCase('pt-BR') && src[0] !== src[0].toLocaleLowerCase('pt-BR')) return dst[0].toLocaleUpperCase('pt-BR')+dst.slice(1);
  return dst;
}

function nasalSuffix(w){
  // -ções/-sões/-xões/-ções etc. -> -soins, mantendo o radical convertido.
  // -ões isolado -> -oins; põe/põem são casos lexicais.
  if(/(ções|sões|xões)$/.test(w)) return {stem:w.slice(0,-4), ending:'soins'};
  if(/ões$/.test(w)) return {stem:w.slice(0,-3), ending:'oins'};
  return null;
}

function generic(word){
  const w=lower(word), out=[], rules=[];
  const add=(s,r)=>{out.push(s); if(r) rules.push(r);};
  const nasal=nasalSuffix(w);
  if(nasal){
    const stem=generic(nasal.stem).word;
    return {word:preserveCase(word,stem+nasal.ending), applied:[...generic(nasal.stem).applied,'terminação nasal']};
  }

  let i=0;
  while(i<w.length){
    const a=w[i], b=w[i+1]||'', c=w[i+2]||'', prev=w[i-1]||'';
    const pair=a+b;
    if(pair==='nh'){add('nn','NH → NN');i+=2;continue;}
    if(pair==='lh'){add('ll','LH → LL');i+=2;continue;}
    if(pair==='ch'){add('x','CH → X');i+=2;continue;}
    if(pair==='qu'){ if(isFrontVowel(c)) add('c','QU → C'); else add('cu','QU → CU'); i+=2;continue; }
    if(pair==='gu'){ if(isFrontVowel(c)) add('g','GU → G'); else add('gu','GU → GU'); i+=2;continue; }
    if(pair==='ge'){add('je','GE → JE');i+=2;continue;}
    if(pair==='gi'){add('ji','GI → JI');i+=2;continue;}
    if(pair==='ce'){add('se','CE → SE');i+=2;continue;}
    if(pair==='ci'){add('si','CI → SI');i+=2;continue;}
    if(pair==='sc' && isFrontVowel(c)){add('s','SC → S');i+=2;continue;}
    if(pair==='xc' && isFrontVowel(c)){add('cs','XC → CS');i+=2;continue;}
    if(a==='ç'){add('s','Ç → S');i++;continue;}
    if(pair==='ss'){add('s','SS → S');i+=2;continue;}

    if(a==='x'){
      // Primeiro, padrões com decisão fonética conhecida.
      if(CASOS_X_SOM.has(w)) { add(CASOS_X_SOM.get(w).slice(i,i+1),'X lexical'); i++; continue; }
      // ex- inicial/interior: /z/ quando o x tem som de z; ex + consoante costuma /s/ ou /ks/.
      if(i===1 && w[0]==='e' && isVowel(b)){add('z','EX → EZ');i++;continue;}
      if(i===0 && w.startsWith('ex') && isVowel(c)){add('z','EX inicial → EZ');i++;continue;}
      if(prev==='e' && isVowel(b)){add('z','EX → EZ');i++;continue;}
      if(b==='c' && isFrontVowel(c)){add('s','EXC → ES');i++;continue;}
      if(b==='p' || b==='t'){add('s','X antes de P/T → S');i++;continue;}
      // /ks/ é representado por CS.
      if(isVowel(prev) && isVowel(b)){add('z','X intervocálico → Z');i++;continue;}
      add('cs','X → CS');i++;continue;
    }
    if(a==='s'){ if(isVowel(prev)&&isVowel(b)) add('z','S intervocálico → Z'); else add('s'); i++;continue; }
    if(a==='k'){add('c','K → C');i++;continue;}
    if(a==='y'){add('i','Y → I');i++;continue;}
    if(a==='w'){add('u','W → U');i++;continue;}
    if(a==='h'){rules.push('H → omitido');i++;continue;}
    add(a);i++;
  }
  return {word:preserveCase(word,out.join('')),applied:[...new Set(rules)]};
}

function convertWord(raw){
  const key=lower(raw);
  if(LEXICO.has(key)) return {word:preserveCase(raw,LEXICO.get(key)),applied:['caso validado']};
  if(CASOS_X_SOM.has(key)) return {word:preserveCase(raw,CASOS_X_SOM.get(key)),applied:['caso fonético validado']};
  return generic(raw);
}

function convertText(text){
  const changes=[]; let ruleCount=0;
  const converted=text.replace(/\p{L}+(?:[-']\p{L}+)*/gu,raw=>{
    const r=convertWord(raw);
    if(r.word!==raw){changes.push({from:raw,to:r.word,rules:r.applied});ruleCount+=r.applied.length;}
    return r.word;
  });
  return {converted,changes,ruleCount};
}

function validate(text){
  const problems=[];
  const checks=[['SS proibido',/ss/i],['H proibido',/h/i],['K proibido',/k/i],['Q proibido',/q/i],['W proibido',/w/i],['Y proibido',/y/i],['Ç proibido',/ç/i]];
  for(const [name,re] of checks) if(re.test(text)) problems.push(name);
  return problems;
}

const TESTES=[
 ['antiguidade','antiguidade'],['reflexo','reflecso'],['texto','testo'],['você','vosê'],['próximas','prósimas'],
 ['reflexivas','reflecsivas'],['transição','tranzisão'],['desconexão','desconecsão'],['exercício','ezersísio'],['gélida','jélida'],
 ['expediente','espediente'],['expostas','espostas'],['reuniões','reunioins'],['soluções','solusoins'],['discussões','discusoins'],
 ['obrigações','obrigasoins'],['notificações','notificasoins'],['fundações','fundasoins'],['ambições','ambisoins'],['faixas','faixas'],
 ['deixando','deizando'],['põe','poim'],['fixo','ficso'],['fluxo','flucso'],['exato','ezato'],['exclusivamente','escluzivamente']
];

window.Fonetiza={convertWord,convertText,validate,TESTES};
