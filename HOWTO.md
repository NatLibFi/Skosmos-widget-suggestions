git clone https://github.com/NatLibFi/Skosmos-widget-suggestions.git

sudo chown -R fintodata:fintodata *

cp -p ../Skosmos-widget-suggestions-korvaa-pian-nykyisen/gh_prx.php .

cp -p .secret.php .secret.php_orig

less ../../../../../etc/.secret.php
<?php
$config['gh_token'] = "token hash...";
$config['white_address'] = "127.0.0.1";
$config['allowed_ip'] = "*";
$config['to_endpoint'] = "https://api.github.com/repos/miguelahonen/c/issues";

/var/www/Skosmos-plugins/Skosmos-widget-suggestions/component-bundler/src/prx.json
[
  {
    "url": "https://finto.fi/plugins/suggestions/gh_prx.php"
  }
]
