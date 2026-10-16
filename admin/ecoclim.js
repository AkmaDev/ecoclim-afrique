// Tableau de bord Ecoclim : libellés simplifiés pour un usage non technique.
// Part de la traduction officielle (locale-fr.js) et ne remplace que les textes ambigus.

(function () {
  const textes = {
    auth: {
      loginWithNetlifyIdentity: 'Se connecter'
    },
    collection: {
      collectionTop: {
        newButton: '＋ Nouvel article',
        newButtonAriaLabel: 'Écrire un nouvel article'
      },
      entries: {
        loadingEntries: 'Chargement des articles',
        cachingEntries: 'Chargement des articles',
        noEntries: 'Aucun article pour le moment'
      }
    },
    editor: {
      editor: {
        onPublishing: 'Mettre cet article en ligne sur le site ?',
        onDeleteWithUnsavedChanges: 'Supprimer définitivement cet article du site ?',
        onDeletePublishedEntry: 'Supprimer définitivement cet article du site ?',
        loadingEntry: "Chargement de l'article...",
        confirmLoadBackup: "Une version non enregistrée de cet article a été retrouvée. Voulez-vous la reprendre ?"
      },
      editorToolbar: {
        publish: 'Publier',
        publishing: 'Publication...',
        published: 'En ligne',
        publishNow: 'Publier maintenant',
        publishAndCreateNew: 'Publier et écrire un autre article',
        publishAndDuplicate: 'Publier et dupliquer',
        deleteEntry: "Supprimer l'article",
        deletePublishedEntry: "Supprimer l'article",
        deleteUnpublishedEntry: "Supprimer l'article",
        backCollection: ' Retour à la liste des articles',
        unsavedChanges: 'Modifications pas encore publiées',
        changesSaved: 'Article publié',
        deployButtonLabel: 'Voir sur le site'
      },
      editorWidgets: {
        markdown: {
          headings: 'Intertitres'
        },
        headingOptions: {
          headingTwo: 'Intertitre',
          headingThree: 'Sous-intertitre'
        },
        image: {
          choose: 'Ajouter une image',
          chooseDifferent: "Changer d'image",
          remove: "Retirer l'image"
        }
      }
    },
    mediaLibrary: {
      mediaLibraryCard: {
        draft: 'Nouvelle'
      },
      mediaLibrary: {
        onDelete: 'Supprimer cette image de la bibliothèque ?'
      },
      mediaLibraryModal: {
        images: 'Cliquez sur une image, puis sur « Utiliser cette image »',
        search: 'Rechercher une image...',
        noImagesFound: 'Aucune image pour le moment. Cliquez sur « Ajouter une image depuis mon ordinateur ».',
        uploading: 'Envoi en cours...',
        upload: 'Ajouter une image depuis mon ordinateur',
        deleteSelected: 'Supprimer de la bibliothèque',
        chooseSelected: 'Utiliser cette image'
      }
    },
    ui: {
      toast: {
        onFailToPersist: "L'article n'a pas pu être enregistré : %{details}",
        onFailToDelete: "L'article n'a pas pu être supprimé : %{details}",
        missingRequiredField: 'Il manque une information obligatoire (encadrée en rouge).',
        entrySaved: 'Article enregistré',
        entryPublished: 'Article publié : il sera visible sur le site dans 1 à 2 minutes.',
        entryUpdated: 'Article mis à jour'
      }
    }
  };

  function fusionner(base, ajouts) {
    for (const cle in ajouts) {
      if (ajouts[cle] && typeof ajouts[cle] === 'object') {
        base[cle] = fusionner(base[cle] || {}, ajouts[cle]);
      } else {
        base[cle] = ajouts[cle];
      }
    }
    return base;
  }

  CMS.registerLocale('fr', fusionner(window.DECAP_FR, textes));

  // Boutons de la bibliothèque d'images inutiles ou risqués pour le client
  // (« Supprimer » effaçait une image même utilisée par un article publié)
  const boutonsMasques = ['Copier le nom', 'Copier', 'Télécharger', 'Supprimer de la bibliothèque'];
  new MutationObserver(() => {
    document.querySelectorAll('button').forEach(b => {
      if (boutonsMasques.includes(b.textContent.trim())) b.style.display = 'none';
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
