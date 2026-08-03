// Pure translation dictionary — safe to import from client components.
// Cookie-based locale selection lives in lib/locale.js (server-only).

export const LOCALES = ['es', 'fr'];
export const DEFAULT_LOCALE = 'es';

export const translations = {
  es: {
    eyebrow: 'Junto a sus familias',
    date: 'Domingo, 6 de junio de 2027',
    place: 'Yerbabuena · La Ceja',
    theDay: 'El gran día',
    ceremony: 'Ceremonia',
    ceremonyTime: '4:00 p. m.',
    ceremonyPlace: 'Yerbabuena, La Ceja',
    reception: 'Recepción',
    receptionTime: 'A continuación',
    receptionPlace: 'Yerbabuena, La Ceja',
    storyTitle: 'Nuestra historia',
    storyHowWeMet: 'Cómo nos conocimos',
    storyHowWeMetBody:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    storyProposal: 'La propuesta',
    storyProposalBody:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    galleryTitle: 'Galería',
    rsvpTitle: 'RSVP',
    rsvpNote:
      'Por favor usa el enlace personal de tu invitación para confirmar tu asistencia.',
    footer: 'Con amor, Manuela & Juan Manuel',
    invitedEyebrow: 'Tienes una invitación',
    hm: 'Ups',
    notFound:
      'No pudimos encontrar una invitación en este enlace. Por favor, verifica el enlace.',
    play: 'Tocar para reproducir',
    skip: 'Saltar',
    updateNote: 'Actualiza tu respuesta a continuación.',
    attendingLabel: '¿Podrás asistir?',
    yes: 'Sí',
    no: 'No',
    partyNote: 'Tu invitación incluye {count} invitados.',
    sendBtn: 'Enviar RSVP',
    updateBtn: 'Actualizar RSVP',
    sending: 'Enviando…',
    confirmYes: '¡Gracias! No podemos esperar para celebrar contigo.',
    confirmNo: 'Gracias por avisarnos. Te extrañaremos.',
    changeResponse: 'Cambiar mi respuesta',
    deadline: 'Por favor, responde antes del 1 de septiembre de 2026.',
    error:
      'Algo salió mal al enviar tu respuesta. Por favor, inténtalo de nuevo.',
  },
  fr: {
    eyebrow: 'Avec leurs familles',
    date: 'Dimanche 6 juin 2027',
    place: 'Yerbabuena · La Ceja',
    theDay: 'Le jour J',
    ceremony: 'Cérémonie',
    ceremonyTime: '16 h 00',
    ceremonyPlace: 'Yerbabuena, La Ceja',
    reception: 'Réception',
    receptionTime: 'À suivre',
    receptionPlace: 'Yerbabuena, La Ceja',
    storyTitle: 'Notre histoire',
    storyHowWeMet: 'Comment nous nous sommes rencontrés',
    storyHowWeMetBody:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    storyProposal: 'La demande en mariage',
    storyProposalBody:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    galleryTitle: 'Galerie',
    rsvpTitle: 'RSVP',
    rsvpNote:
      'Merci d’utiliser le lien personnel de votre invitation pour confirmer votre présence.',
    footer: 'Avec amour, Manuela & Juan Manuel',
    invitedEyebrow: 'Vous êtes invité(e)',
    hm: 'Oups',
    notFound:
      'Nous n’avons pas trouvé d’invitation à ce lien. Veuillez vérifier le lien.',
    play: 'Toucher pour lire',
    skip: 'Passer',
    updateNote: 'Mettez à jour votre réponse ci-dessous.',
    attendingLabel: 'Serez-vous présent(e) ?',
    yes: 'Oui',
    no: 'Non',
    partyNote: 'Votre invitation inclut {count} invités.',
    sendBtn: 'Envoyer le RSVP',
    updateBtn: 'Mettre à jour le RSVP',
    sending: 'Envoi…',
    confirmYes: 'Merci ! Nous avons hâte de célébrer avec vous.',
    confirmNo: 'Merci de nous avoir prévenus. Vous nous manquerez.',
    changeResponse: 'Modifier ma réponse',
    deadline: 'Merci de répondre avant le 1er septembre 2026.',
    error:
      'Une erreur s’est produite lors de l’envoi de votre réponse. Veuillez réessayer.',
  },
};

export function t(locale, key, vars = {}) {
  const str = translations[locale]?.[key] ?? translations[DEFAULT_LOCALE][key] ?? key;
  return str.replace(/\{(\w+)\}/g, (match, name) =>
    vars[name] != null ? vars[name] : match
  );
}
