/** UI copy keyed by profile `languagePref` (en, es, fil, fr). */

const en = {
  nav_search: 'Search',
  nav_home: 'Home',
  nav_movies: 'Movies',
  nav_tv: 'TV Shows',
  nav_myList: 'My List',
  nav_profile: 'Profile',
  nav_admin: 'Admin',
  nav_signOut: 'Sign out',

  profile_accountTitle: 'Account',
  profile_accountSubtitle:
    'Manage membership, profiles, and preferences (StreamLab prototype).',

  profile_nav_overview: 'Overview',
  profile_nav_membership: 'Membership & billing',
  profile_nav_settings: 'Edit settings',
  profile_nav_password: 'Update password',

  settings_title: 'Edit settings',
  settings_subtitle:
    'Languages, viewing activity, and other preferences for {{name}}.',

  settings_displayLanguage: 'Display language',
  settings_displayLanguageHelp:
    'Applies to this profile (menus and on-screen text where supported).',
  settings_langLabel: 'Display language',
  settings_saving: 'Saving…',
  settings_langUpdated: 'Display language updated.',
  settings_moreProto: 'More (prototype)',
  settings_playback: 'Playback & quality',
  settings_playbackSub:
    'Autoplay and quality follow your plan (coming soon).',
  settings_notifications: 'Notifications',
  settings_notificationsSub: 'Email and device alerts (coming soon).',
  settings_viewingActivity: 'Viewing activity',
  settings_viewingActivityHelp:
    'Progress for the active profile from Watch history (MongoDB).',
  settings_noActivity: 'No viewing activity yet.',
  settings_watched: 'Watched',
  settings_completed: 'Completed',
  settings_resume: 'Resume',

  overview_signedInAs: 'Signed in as',
  overview_accountStatus: 'Account status:',
  overview_profiles: 'Profiles',
  overview_profilesHelp:
    'Switch who is watching (maturity and language follow each profile).',
  overview_membership: 'Membership',
  overview_nextBilling: 'Next billing:',
  overview_status: 'Status:',
  overview_noSub: 'No active subscription on file.',
  overview_manageMembership: 'Manage membership',
  overview_quickLinks: 'Quick links',
  overview_changePlan: 'Change plan',
  overview_billingInvoices: 'Billing & invoices',
  overview_editSettings: 'Edit settings',
  overview_editSettingsSub: 'Languages, viewing activity, and more',
  overview_updatePassword: 'Update password',
  overview_updatePasswordSub: 'Change your sign-in password',
  overview_tvDevices: 'TV & other devices',
  overview_tvDevicesHelp:
    'Sign in on another browser without typing your password: generate a code here, then on the other device open Sign in → Use a sign-in code.',
  overview_yourCode: 'Your code:',
  overview_expires: '(expires in about 10 minutes)',
  overview_generateCode: 'Generate sign-in code',

  layout_loadingCatalog: 'Loading catalog…',

  lang_en: 'English',
  lang_es: 'Spanish',
  lang_fil: 'Filipino',
  lang_fr: 'French',
}

const es = {
  ...en,
  nav_search: 'Buscar',
  nav_home: 'Inicio',
  nav_movies: 'Películas',
  nav_tv: 'Series',
  nav_myList: 'Mi lista',
  nav_profile: 'Perfil',
  nav_signOut: 'Cerrar sesión',

  profile_accountTitle: 'Cuenta',
  profile_accountSubtitle:
    'Gestiona membresía, perfiles y preferencias (prototipo StreamLab).',

  profile_nav_overview: 'Resumen',
  profile_nav_membership: 'Membresía y facturación',
  profile_nav_settings: 'Editar ajustes',
  profile_nav_password: 'Actualizar contraseña',

  settings_title: 'Editar ajustes',
  settings_subtitle:
    'Idioma, actividad de visualización y otras preferencias para {{name}}.',

  settings_displayLanguage: 'Idioma de pantalla',
  settings_displayLanguageHelp:
    'Se aplica a este perfil (menús y textos cuando esté disponible).',
  settings_langLabel: 'Idioma de pantalla',
  settings_saving: 'Guardando…',
  settings_langUpdated: 'Idioma de pantalla actualizado.',
  settings_moreProto: 'Más (prototipo)',
  settings_playback: 'Reproducción y calidad',
  settings_playbackSub:
    'Autoplay y calidad según tu plan (próximamente).',
  settings_notifications: 'Notificaciones',
  settings_notificationsSub:
    'Alertas por correo y dispositivo (próximamente).',
  settings_viewingActivity: 'Actividad de visualización',
  settings_viewingActivityHelp:
    'Progreso del perfil activo en el historial (MongoDB).',
  settings_noActivity: 'Aún no hay actividad de visualización.',
  settings_watched: 'Visto',
  settings_completed: 'Completado',
  settings_resume: 'Reanudar',

  overview_signedInAs: 'Sesión iniciada como',
  overview_accountStatus: 'Estado de la cuenta:',
  overview_profiles: 'Perfiles',
  overview_profilesHelp:
    'Cambia quién está viendo (madurez e idioma por perfil).',
  overview_membership: 'Membresía',
  overview_nextBilling: 'Próximo cobro:',
  overview_status: 'Estado:',
  overview_noSub: 'No hay suscripción activa.',
  overview_manageMembership: 'Gestionar membresía',
  overview_quickLinks: 'Enlaces rápidos',
  overview_changePlan: 'Cambiar plan',
  overview_billingInvoices: 'Facturación y recibos',
  overview_editSettings: 'Editar ajustes',
  overview_editSettingsSub: 'Idiomas, actividad y más',
  overview_updatePassword: 'Actualizar contraseña',
  overview_updatePasswordSub: 'Cambiar la contraseña de acceso',
  overview_tvDevices: 'TV y otros dispositivos',
  overview_tvDevicesHelp:
    'Entra en otro navegador sin escribir la contraseña: genera un código aquí y en el otro dispositivo ve a Iniciar sesión → Usar código.',
  overview_yourCode: 'Tu código:',
  overview_expires: '(caduca en unos 10 minutos)',
  overview_generateCode: 'Generar código de acceso',

  layout_loadingCatalog: 'Cargando catálogo…',

  lang_en: 'Inglés',
  lang_es: 'Español',
  lang_fil: 'Filipino',
  lang_fr: 'Francés',
}

const fil = {
  ...en,
  nav_search: 'Hanapin',
  nav_home: 'Home',
  nav_movies: 'Mga Pelikula',
  nav_tv: 'Mga Serye',
  nav_myList: 'Aking Listahan',
  nav_profile: 'Profile',
  nav_signOut: 'Mag-sign out',

  profile_accountTitle: 'Account',
  profile_accountSubtitle:
    'Pamahalaan ang membership, profile, at mga setting (StreamLab prototype).',

  profile_nav_overview: 'Buod',
  profile_nav_membership: 'Membership at billing',
  profile_nav_settings: 'I-edit ang settings',
  profile_nav_password: 'Baguhin ang password',

  settings_title: 'I-edit ang settings',
  settings_subtitle:
    'Wika, viewing activity, at iba pang setting para kay {{name}}.',

  settings_displayLanguage: 'Wika sa screen',
  settings_displayLanguageHelp:
    'Para sa profile na ito (menu at text kung suportado).',
  settings_langLabel: 'Wika sa screen',
  settings_saving: 'Sine-save…',
  settings_langUpdated: 'Na-update ang wika sa screen.',
  settings_viewingActivity: 'Viewing activity',
  settings_viewingActivityHelp:
    'Progress ng aktibong profile mula sa Watch history (MongoDB).',
  settings_noActivity: 'Walang viewing activity pa.',
  settings_watched: 'Napanood',
  settings_completed: 'Tapos na',
  settings_resume: 'Ituloy',

  overview_signedInAs: 'Naka-sign in bilang',
  overview_accountStatus: 'Status ng account:',
  overview_profiles: 'Mga Profile',
  overview_quickLinks: 'Mabilisang link',
  overview_tvDevices: 'TV at iba pang device',
  overview_generateCode: 'Gumawa ng sign-in code',

  layout_loadingCatalog: 'Nilo-load ang catalog…',

  lang_en: 'English',
  lang_es: 'Spanish',
  lang_fil: 'Filipino',
  lang_fr: 'French',
}

const fr = {
  ...en,
  nav_search: 'Recherche',
  nav_home: 'Accueil',
  nav_movies: 'Films',
  nav_tv: 'Séries',
  nav_myList: 'Ma liste',
  nav_profile: 'Profil',
  nav_signOut: 'Déconnexion',

  profile_accountTitle: 'Compte',
  profile_accountSubtitle:
    'Gérez l’abonnement, les profils et les préférences (prototype StreamLab).',

  profile_nav_overview: 'Aperçu',
  profile_nav_membership: 'Abonnement et facturation',
  profile_nav_settings: 'Modifier les paramètres',
  profile_nav_password: 'Mettre à jour le mot de passe',

  settings_title: 'Modifier les paramètres',
  settings_subtitle:
    'Langue, historique de visionnage et autres préférences pour {{name}}.',

  settings_displayLanguage: 'Langue d’affichage',
  settings_displayLanguageHelp:
    'S’applique à ce profil (menus et textes à l’écran lorsque disponible).',
  settings_langLabel: 'Langue d’affichage',
  settings_saving: 'Enregistrement…',
  settings_langUpdated: 'Langue d’affichage mise à jour.',
  settings_moreProto: 'Plus (prototype)',
  settings_viewingActivity: 'Activité de visionnage',
  settings_viewingActivityHelp:
    'Progression du profil actif (historique MongoDB).',
  settings_noActivity: 'Pas encore d’activité de visionnage.',
  settings_watched: 'Vu',
  settings_completed: 'Terminé',
  settings_resume: 'Reprendre',

  overview_signedInAs: 'Connecté en tant que',
  overview_accountStatus: 'Statut du compte :',
  overview_profiles: 'Profils',
  overview_manageMembership: 'Gérer l’abonnement',
  overview_quickLinks: 'Raccourcis',
  overview_changePlan: 'Changer de formule',
  overview_billingInvoices: 'Facturation et factures',
  overview_editSettings: 'Modifier les paramètres',
  overview_updatePassword: 'Mettre à jour le mot de passe',
  overview_tvDevices: 'TV et autres appareils',
  overview_yourCode: 'Votre code :',
  overview_generateCode: 'Générer un code de connexion',

  layout_loadingCatalog: 'Chargement du catalogue…',

  lang_en: 'Anglais',
  lang_es: 'Espagnol',
  lang_fil: 'Filipino',
  lang_fr: 'Français',
}

export const UI_LOCALES = {
  en,
  es,
  fil,
  fr,
}

export function interpolate(str, vars) {
  if (!str || !vars) return str
  return Object.keys(vars).reduce(
    (acc, k) => acc.replaceAll(`{{${k}}}`, String(vars[k] ?? '')),
    str
  )
}
