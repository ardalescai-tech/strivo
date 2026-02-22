export const messagesZiRatata = [
  "Serios? Nici azi nu ai reușit? Poate mâine o să fie diferit... sau nu.",
  "Altă zi, același rezultat. Când zici că începi cu adevărat?",
  "Știi ce e amuzant? Ieri ai zis că mâine va fi altfel. Și ieri. Și alaltăieri.",
  "Aplicația ta de productivitate te privește dezamăgit. Chiar dezamăgit.",
  "Ziua a trecut. Task-urile nu. Coincidență? Nu cred.",
  "Ai ratat-o. Din nou. Dar cel puțin ești consistent în asta.",
  "Visele mari necesită zile mari. Azi nu a fost una dintre ele.",
  "Streak: 0. Scuze: probabil multe. Rezultate: niciuna.",
  "Undeva, o versiune mai bună a ta face ce tu nu ai făcut azi.",
  "Nu e sfârșitul lumii. Dar nici nu e începutul schimbării.",
]

export const messagesZiBuna = [
  "Ai terminat ziua! Streak-ul tău îți mulțumește.",
  "Asta se cheamă consistență. Continuă!",
  "Ziua bifată. Mâine o iei de la capăt și o faci din nou.",
  "Bravo! Acum nu te opri aici.",
  "O zi câștigată. Streak-ul crește. Tu crești.",
]

export const messagesNoapte = [
  "E miezul nopții. Ai terminat tot ce ți-ai propus azi?",
  "00:00 — o nouă zi începe. Cea veche cum s-a încheiat?",
  "Ziua s-a terminat. Deschide Strivo și vezi unde ai ajuns.",
  "Miezul nopții a sosit. Task-urile tale te așteaptă să le evaluezi.",
  "Timp de bilanț. Cum a arătat ziua ta azi?",
]

export const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)]
}