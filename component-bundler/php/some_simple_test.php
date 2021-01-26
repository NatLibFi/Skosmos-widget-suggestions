<?php
header('Access-Control-Allow-Origin: *');
// 'Access-Control-Allow-Origin': '*',
// 'Content-Type': 'application/json',
// 'Accept': 'application/vnd.github.v3.raw',
// 'Authorization':  gh_secret.gh_Token

function apiCall( $requestMethod, $body = null ){

  require_once('../.secret.php');
  define('ACCESS_TOKEN', $config['gh_token']);
  define('CONTENT_TYPE', 'application/json');
  define('ACCEPTS', 'application/vnd.github.v3.raw');
  define('ENDPOINT', $config['to_endpoint']);
  define('ASTERIX', $config['allowed_ip']);
  define ('USER_AGENT', 'PHP');

  $curl = curl_init( ENDPOINT );
  $options = array(
    'Access-Control-Allow-Methods: PUT, POST',
    'Access-Control-Allow-Origin: '. ASTERIX .'',
    'Authorization: '.  ACCESS_TOKEN  .'',
    'Content-Type: '.  CONTENT_TYPE  .'',
    'Accept: '.        ACCEPTS       .'',
    'user-agent: '. USER_AGENT .'',
  );

  curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
  curl_setopt( $curl, CURLOPT_HTTPHEADER    , $options );
  curl_setopt( $curl, CURLOPT_CUSTOMREQUEST , $requestMethod );

  if( $requestMethod == 'POST' || $requestMethod == 'PUT' ){
    curl_setopt( $curl, CURLOPT_POSTFIELDS, $body );
  }
  $curlResponse = curl_exec( $curl );
  $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
  $decoded_result = json_decode($curlResponse, true);

  if ($e = curl_error($curl)) {
    $resp_array = array("status" => $http_code, "error" => $e);
  } else {
    $resp_array = array("status" => $http_code, "url" => $decoded_result['url']);
  }
  $resp_json = json_encode($resp_array, JSON_PRETTY_PRINT);

  curl_close($curl);
  return $resp_json;
  }
$raw_response = apiCall( 'POST', $_GET['payload'] );
echo $raw_response;


// https://github.com/FortnoxAB/api-example-php
// php -S localhost:8000

?>
