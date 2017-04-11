<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header("Content-Type: application/json; charset=UTF-8, accept");

$api = 'http://sg.media-imdb.com/suggests/';
$search = !empty($_GET['search']) ? $_GET['search'] : "";
$callback = $_GET['callback'] . '(';
if(!empty($search)) {
  $firstChar = substr($search, 0, 1);
  $searchApi = $api . $firstChar  . '/' . $search . '.json';
  $json = file_get_contents($searchApi);
  $result = '{' . (substr($json, strpos($json, '"d":'), -1));
  $result = cleanUp($result);
}

if(preg_match("^{imdb^", $result, $match) || empty($search))
  $result = '{"d":[]}';
echo $callback . $result . ')';


function cleanUp($result) {
  $toReplace = array('"l"', '"i"', '"id"', '"s"', '"y"', '.jpg');
  $replaceBy = array('"name"', '"image"', '"url"', '"stars"', '"year"', '');
  $result = str_replace($toReplace, $replaceBy, $result);
  return $result;
}

?>