<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Invoice</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap">

        <!-- Scripts -->
        @vite(['resources/css/app.css'])

        <script type="text/javascript">
            setTimeout(function () { window.print(); }, 500);
            window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
        </script>

    </head>
    <body class="font-sans antialiased p-2">
        <div class="font-bold w-full text-3xl">{{ \App\Models\Setting::getValue('name') }}</div>
        <div class="w-full flex flex-row space-x-5 mt-5">
            <div class="w-2/3">
                {!! \App\Models\Setting::getValue('detail') !!}
            </div>
            <div class="w-1/3 flex flex-col">
                <table>
                    <tbody>
                        <tr>
                            <td class="font-bold">FAKTUR #</td>
                            <td>:</td>
                            <td>{{ $sale->code }}</td>
                        </tr>
                        <tr>
                            <td class="font-bold">TANGGAL</td>
                            <td>:</td>
                            <td>{{ $sale->formated_date }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-2xl w-full flex flex-row space-x-2">
            <hr class="w-2/3 mt-3.5 border-1 border-gray-600"/>
            <div class="w-1/3 flex flex-row space-x-2">
                <div>FAKTUR</div>
                <hr class="w-full mt-3.5 border-1 border-gray-600"/>
            </div>
        </div>
        <div class="flex flex-row w-full space-x-3">
            <div class="flex flex-col w-1/2">
                <div>PELANGGAN</div>
                <table class="border-2 border-black">
                    <tbody>
                        <tr>
                            <td class="p-1">NAMA</td>
                            <td class="p-1">{{ $sale->customer?->name }}</td>
                        </tr>
                        <tr>
                            <td class="p-1">ALAMAT</td>
                            <td class="p-1">{{ $sale->customer?->address }}</td>
                        </tr>
                        <tr>
                            <td class="p-1">TELP</td>
                            <td class="p-1">{{ $sale->customer?->phone }}</td>
                        </tr>
                        <tr>
                            <td class="p-1">FAX</td>
                            <td class="p-1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="w-1/2">
                <div class="invisible">KETERANGAN</div>
                <table class="border-2 border-black w-full h-[132px] invisible">
                    <tbody>
                        <tr>
                            <td class="p-1"></td>
                            <td class="p-1"></td>
                        </tr>
                        <tr>
                            <td class="p-1">JATUH TEMPO</td>
                            <td class="p-1"></td>
                        </tr>
                        <tr>
                            <td class="p-1"></td>
                            <td class="p-1"></td>
                        </tr>
                        <tr>
                            <td class="p-1"></td>
                            <td class="p-1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="w-full mt-7">
            <table class="w-full">
                <tbody>
                    <tr>
                        <td class="border border-black font-bold p-1 w-[10px]">NO.</td>
                        <td class="border border-black font-bold p-1">KETERANGAN</td>
                        <td class="border border-black font-bold p-1 text-right w-1/6">QTY</td>
                        <td class="border border-black font-bold p-1 text-right w-1/6">HARGA SATUAN (Rp.)</td>
                        <td class="border border-black font-bold p-1 text-right w-1/6">JUMLAH (Rp.)</td>
                    </tr>
                    @foreach($sale->items as $index => $item)
                    <tr>
                        <td class="border border-black p-1">{{ $index + 1 }}</td>
                        <td class="border border-black p-1">{{ $item->product->name }}</td>
                        <td class="border border-black p-1 text-right">{{ number_format($item->quantity, 0, ',', '.') }}</td>
                        <td class="border border-black p-1 text-right">{{ number_format($item->price, 0, ',', '.') }}</td>
                        <td class="border border-black p-1 text-right">{{ number_format($item->quantity * $item->price, 0, ',', '.') }}</td>
                    </tr>
                    @endforeach
                    <tr>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="border border-black p-1">Subtotal</td>
                        <td class="border border-black p-1 text-right">{{ number_format($sale->total, 0, ',', '.') }}</td>
                    </tr>
                    <tr>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="font-bold border border-black p-1">TOTAL</td>
                        <td class="font-bold border border-black p-1 text-right">{{ number_format($sale->total, 0, ',', '.') }}</td>
                    </tr>
                    <tr>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="border border-black p-1">Bayaran Diterima</td>
                        <td class="border border-black p-1 text-right">{{ number_format($sale->total, 0, ',', '.') }}</td>
                    </tr>
                    <tr>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="p-1"></td>
                        <td class="p-1">Sisa Tagihan</td>
                        <td class="border border-black p-1 text-right">0</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full mt-10">
            <table class="border-collapse border border-black w-2/4">
                <tbody>
                    <tr>
                        <td class="p-2 font-bold">PESAN</td>
                    </tr>
                    <tr>
                        <td class="px-2 pb-2">{{ $sale->note }}</td>
                    </tr>
                    <tr>
                        <td class="p-2"></td>
                    </tr>
                    <tr>
                        <td class="p-4"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full flex flex-row justify-end mt-24">
            <hr class="w-[200px] border-[1px] border-gray-400"/>
        </div>
    </body>
</html>
