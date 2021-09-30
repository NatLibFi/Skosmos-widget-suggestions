# Skosmos-widget-suggestions

Skosmos plugin for making suggestions for new concepts or alterations to existing concepts

## How it works

This Suggestions plugin enhances Skosmos vocabularies and concept pages with suggestion forms, which allow users to suggest new concepts or alterations to existing concepts.
Firstly, this provides a button on the vocabulary's home page, which opens the form for suggesting new concepts as a dialog. On the other hand, each concept page has a button for suggesting alterations for the viewed concept in another form.

When the plugin is added to the Skosmos environment, update the correct Suggestion-handling environment API url (`SUGGESTION_API_BASE_URL`) to **widget.js**.

This plugin fulfills the requirements for [Skosmos](https://github.com/NatLibFi/Skosmos) [plugins](https://github.com/NatLibFi/Skosmos/wiki/Plugins).

To make changes the dialog forms this widget provides (e.g. to update translations), see the `component-bundler` folder. The dialog forms are provided with the **components.js** file, which is created with the bundler. See the bundler's [README](https://github.com/NatLibFi/Skosmos-widget-suggestions/tree/master/component-bundler) for more information.

## Additionally

Pollutes the global namespace with `SUGGESTIONS` and `SUGGESTION_API_BASE_URL`.

## Installation

KESKEN/KÄÄNNETTÄVÄNÄ

# Minimivaatimukset:
PHP 	7.2
Node 	10.19.0
npm 	7.20.0

# Valitse asennuskansio:
Siirry Skosmoksen alla olevaan plugins-kansioon (voi myös olla symbolinen linkki) tai luo kyseinen kansio (mkdir plugins):
`cd plugins`

# Vedä asennuspaketti Github.comista:
`git pull https://github.com/NatLibFi/Skosmos-widget-suggestions.git`

# Sijoita issuet (käsite-ehdotukset) GitHubiin välittävä php-proxy haluaamaasi paikkaan:
Proxyn tulee sijaita palvelimella kansiossa, johon pääsy on sallittu portin 80 läpi ja jossa voi ajaa php-tiedostoja. 
`cd Skosmos-widget-suggestions`
`mv component-bundler/php/gh_prx.php/gh_prx.php [valitsemasi julkinen php-kansio]`

# Luo GitHubissa token, jota käytetään widgetin autorisoinnissa issuet sisältävään repositoryyn:
Tokeneihin liittyvät käytännöt ovat muuttuneet ajan saatossa paljon ja ne saattavat poiketa ohjeen kirjoittamishetekn tilantcd Skosmos-widget-suggestionseesta, mutta tärkeintä on, että luomasi token sallii issueiden luomisen kohteena oevan GitHub-tilin ja -repositoryn ulkopuolelta.l
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

# Aseta token käyttöön ehdotus-widgetiä varten:
On äärimmäisen tärkeää, että token ei vaarannu, joten sen sisältävän tiedoston tulee ehdottomasti sijaita palvelimella kansiossa, johon ulkopuolisilla ei ole mitään kautta pääsyä, mutta johon php-proxyllä on pääsy.
`cp -p ./component-bundler/.secret.php_change_this [haluamasti turvallinen kansio palvelimellasi]/.secret.php`
`vim [haluamasti turvallinen kansio palvelimellasi]/.secret.php`
(aseta tiedostossa oleville avaimille haluamasi arvot)
$config['gh_token'] = "token aiemmin_luomasi_token";
$config['white_address'] = "127.0.0.1";
$config['allowed_ip'] = "*";
$config['to_endpoint'] = "https://api.github.com/repos/[GitHub-käyttäjäsi]/[repository]/issues";
`Esc`
`:`
`wq!`

# Anna php-proxylle tieto tokenin sisältämästä tiedostosta:
`vim [valitsemasi julkinen php-kansio]/gh_prx.php`
(etsi rivi, jolla lukee require_once('../.secret.php');)
(muuta polku vastaaman sijaintia, johon secret.php:n sijoitit: [haluamasti turvallinen kansio palvelimellasi]/.secret.php)
`Esc`
`:`
`wq!`

# Anna widgetille tieto siitä, missä osoitteessa php-proxy vastaa:
`mv ./component-bundler/src/prx_change.json ./component-bundler/src/prx.json`
`vim ./component-bundler/src/prx.json`
(aseta kohdassa "url": "url.." arvoksi url, josta php-proxy vastaa)
Esimerkiksi: "url": "https://yourdomain.dom/plugins/suggestions/gh_prx.php"
`Esc`
`:`
`wq!`

# Siirry asennuspaketin sisältävään kansioon:
`cd component-bundler`

# Asenna Noden moduulit: Luo kansion node_modules, joka tulee sisältämään widgetin käyttämät JavaScript-paketit:
(saattaa ilmoittaa virheistä, mutta ne eivät haittaa, koska mahdolliset virheet korjaantuvat seuraavan vaiheen aikana)
`npm install`

# Rakenna ehdotus-widget packages.json-tiedostossa määriteltyjen pakettien ja niiden versioiden mukaan:
Alla oleva skripti ajaa rimraf-komennon, joka poistaa sovelluksen jo mahdollisesti käyttämän jakelukansion "dist" sekä rakentaa webpackillä src-kansion alla olevaan koodiin pohjautuvan components.js-tiedoston uudelleenluotuun dist-kansioon sekä kopioi sen myös sovelluksen juureen, jotta widget täyttää Skosmoksen plugineille määritellyt vaatimukset. Widgetiä käytettäessä components.js-tiedosto latautuu käyttäjän selaimeen ja se siltältää kaikki widgetin toiminnallisuudet.
`./build-suggestion-widget`

# Aseta Skosmos-asennuksessasi selattava YSO-ontologia käyttämään ehdotus-widgetiä:
Skosmoksen juuressa, config.ttl-tiedostossa, kohdassa :yso, aseta skosmos käyttämään suggestions-widgetiä
skosmos:usePlugin "suggestions" ;


