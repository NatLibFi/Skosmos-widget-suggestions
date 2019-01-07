# Skosmos-widget-suggestions

Skosmos plugin for making suggestions for new concepts or alterations to existing concepts

## How it works

This Suggestions plugin enhances Skosmos vocabularies and concept pages with suggestion forms, which allow users to suggest new concepts or alterations to existing concepts.
Firstly, this provides a button on the vocabulary's home page, which opens the form for suggesting new concepts as a dialog. On the other hand, each concept page has a button for suggesting alterations for the viewed concept.

When the plugin is added to the Skosmos environment, update the correct Suggestion-handling environment API url (`SUGGESTION_API_URL`) to **widget.js**.

This plugin fulfills the requirements for [Skosmos](https://github.com/NatLibFi/Skosmos) [plugins](https://github.com/NatLibFi/Skosmos/wiki/Plugins).

To update the dialog forms this widget provides, for example to make changes translations, see `component-bundler`. This plugin uses a bundled Vue application, which then provides the plugin custom HTML tags/web components through `components.js` for the dialog forms.

## Additionally

Pollutes the global namespace with `SUGGESTIONS` and `SUGGESTION_API_URL`.