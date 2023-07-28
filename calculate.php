<?php

declare(strict_types=1);
$data = json_decode(file_get_contents("php://input"), true);
$total = $data["total"];
$provided = $data["provided"];

$result = getResult($total, $provided);
echo json_encode($result);

function getResult($total, $provided): array
{
    $total = str_replace(",", "", $total);
    $provided = str_replace(",", "", $provided);

    $resultArray = [
        "change" => 0,
        "bills" => ["100" => 0, "50" => 0, "20" => 0, "10" => 0, "5" => 0, "1" => 0],
        "coins" => ["25" => 0, "10" => 0, "5" => 0, "1" => 0]
    ];

    $change = (float) $provided - (float) $total;
    $resultArray["change"] = $change;
    if ($change <= 0) {
        return $resultArray;
    }

    $parts = explode(".", (string) $change);
    $dollars = (int) $parts[0];
    $cents = null;
    if (count($parts) == 2) {
        $val = $parts[1];
        if (strlen($val) == 1) {
            $cents = $val[0] * 10;
        } else {
            if ($val[0] == 0) {
                $cents = $val[1];
            } else {
                $cents = $val;
            }
        }
    }

    while ($dollars > 0) {
        if ((int) ($dollars / 100) > 0) {
            $resultArray["bills"]["100"] += (int) ($dollars / 100);
            $dollars = (int) ($dollars % 100);
        } else if ((int) ($dollars / 50) > 0) {
            $resultArray["bills"]["50"] += (int) ($dollars / 50);
            $dollars = (int) ($dollars % 50);
        } else if ((int) ($dollars / 20) > 0) {
            $resultArray["bills"]["20"] += (int) ($dollars / 20);
            $dollars = (int) ($dollars % 20);
        } else if ((int) ($dollars / 10) > 0) {
            $resultArray["bills"]["10"] += (int) ($dollars / 10);
            $dollars = (int) ($dollars % 10);
        } else if ((int) ($dollars / 5) > 0) {
            $resultArray["bills"]["5"] += (int) ($dollars / 5);
            $dollars = (int) ($dollars % 5);
        } else {
            $resultArray["bills"]["1"] += $dollars;
            break;
        }
    }

    if ($cents != null) {
        while ($cents > 0) {
            if ((int) ($cents / 25) > 0) {
                $resultArray["coins"]["25"] += (int) ($cents / 25);
                $cents = (int) ($cents % 25);
            } else if ((int) ($cents / 10) > 0) {
                $resultArray["coins"]["10"] += (int) ($cents / 10);
                $cents = (int) ($cents % 10);
            } else if ((int) ($cents / 5) > 0) {
                $resultArray["coins"]["5"] += (int) ($cents / 5);
                $cents = (int) ($cents % 5);
            } else {
                $resultArray["coins"]["1"] += $cents;
                break;
            }
        }
    }

    return $resultArray;
}
