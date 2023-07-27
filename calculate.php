<?php

$data = json_decode(file_get_contents("php://input"), true);
$total = $data["total"];
$provided = $data["provided"];

$result = getResult($total, $provided);
echo json_encode($result);

function getResult(float $total, float $provided) : array {

    // transform input into valid floats
    return ["change" => 0,
     "bills" => ["100" => 0, "50" => 0, "20" => 0, "10" => 0, "5" => 0, "1" => 0],
     "coins" => ["25" => 0, "10" => 0, "5" => 0, "1" => 0]];
}