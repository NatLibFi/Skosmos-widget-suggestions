<?php
header('Access-Control-Allow-Origin: *');

function apiCall( $requestMethod, $body = null ){

//  if ($_GET['voc'] == 'liiko') {
//    require_once('../../../../../etc/.secret1.php');
//  } else {
//    require_once('../../../../../etc/.secret.php');
//  }

  require_once('../../../../../etc/.secret.php');
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
  if ($requestMethod === 'OPTIONS') {
    // Respond with the necessary CORS headers
    header('Access-Control-Allow-Methods: PUT, POST');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
    http_response_code(200); // Respond with a 200 status for OPTIONS requests
    exit();
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
  return $resp_json; //orig
  }
$requestMethod = $_SERVER['REQUEST_METHOD'];
$raw_response = apiCall($requestMethod, $_GET['payload']);
echo $raw_response;

// https://github.com/FortnoxAB/api-example-php
// php -S localhost:8000

?>
