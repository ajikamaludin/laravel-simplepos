<?php

namespace App\Services;

class GeneralService
{
    public static function formatNum($num)
    {
        // 0001
        if ($num < 10) {
            return '000' . $num;
        }

        if ($num < 100) {
            return '00' . $num;
        }

        if ($num < 1000) {
            return '0' . $num;
        }

        return $num;
    }
}
