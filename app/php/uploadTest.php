<?php

header('Access-Control-Allow-Origin: *');

$box = $_POST['userid'];
//echo($box);
$img = str_replace('data:audio/wav;base64,', '', $box);
$img = str_replace(' ', '+', $img);
//$data = base64_decode($img);

$data = base64_decode($img);
$file = "uploaded.wav";
// mp3 file name
$mp3_name = "converted.mp3";
$file_target = "".$file;

$success = file_put_contents($file, $data);

$exec = '/usr/local/bin/ffmpeg -i ' . $file_target . ' '.$mp3_name;
//$exec = '/usr/local/bin/ffmpeg -i ' . $file_target . ' ../upld/med/snd/'.$mp3_name;

exec($exec." 2>&1", $out, $ret);
if ($ret){
	echo "There was a problem!\n";
	print_r($out);


}else{

	echo "file successfully uploaded and converted";


}
//echo($success);
//file_put_contents('audio.mp3', base64_decode($box));

?>
