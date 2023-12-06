/* eslint-disable react/no-unescaped-entities */
'use client'

import {useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import Image from "next/image";

const langs = {
    order: {
        tr: "SIRA",
        uk: "ПОРЯДОК",
        en: "ORDER",
    },
    image: {
        tr: "RESİM",
        uk: "ЗОБРАЖЕННЯ",
        en: "IMAGE",
    },
    productFeatures: {
        tr: "ÜRÜN ÖZELLİKLERİ",
        uk: "ХАРАКТЕРИСТИКИ ТОВАРУ",
        en: "PRODUCT FEATURES",
    },
    price: {
        tr: "FİYAT",
        uk: "ЦІНА",
        en: "PRICE",
    },
    quantity: {
        tr: "ADET",
        uk: "КІЛЬ",
        en: "QUANTITY",
    },
    total: {
        tr: "TOPLAM",
        uk: "СУМА",
        en: "TOTAL",
    },
    notFound: {
        tr: "Bulunamadı",
        uk: "Не знайдено",
        en: "Not Found",
    },
    teklifNo: {
        tr: "Teklif no",
        uk: "Тендер №",
        en: "Quotation No",
    },
    invoice: {
        tr: "Fatura",
        uk: "Рахунок",
        en: "Invoice",
    },
    date: {
        tr: "Tarih",
        uk: "Дата",
        en: "Date",
    },
    firmaBilgileri: {
        tr: "Firma Bilgileri",
        uk: "Інформація про компанію",
        en: "Company Information",
    },
    toplam: {
        tr: "Toplam",
        uk: "Всього",
        en: "Total",
    },
    vergi: {
        tr: "Vergi",
        uk: "Податок",
        en: "Tax",
    },
    genelToplam: {
        tr: "Genel Toplam",
        uk: "Загальна сума",
        en: "Grand Total",
    },
};

const selectedLang = "uk"

const Invoice = ({ data, lang }) => {
    const printRef = useRef(null)

    function filterDataByOrderId() {
        const res = {
            order_no: data.orderCode,
            musteri: {
                name: data.Müşteri[0].name + " " + data.Müşteri[0].surname,
                phone: data.Müşteri[0].phoneNumber,
                adress: data.Müşteri[0].address
            },
            products: []
        }

        data.Orders.forEach(value => {
            const or_id = value.id
            const pr_id = value.productId

            let x_d = {
                note: value.orderNote
            }

            data.Ürünler
                .filter(x_f => x_f.id === pr_id)
                .forEach(x_m => {
                    console.log(x_m)
                    x_d = {
                        ...x_d,
                        info: x_m.productType,
                        quantity: Number(value.stock),
                        price: Number(value.productPrice) + Number(value.productFeaturePrice),
                        totalPrice: (Number(value.productPrice) + Number(value.productFeaturePrice)) * Number(value.stock),
                        id: x_m.id,
                        name: x_m.productName,
                    }
                })

            data.Extralar
                ?.filter(x_f => x_f.orderId === pr_id)
                ?.forEach(x_k => {
                    x_d = {
                        ...x_d,
                        extras: x_d?.extras ? [...x_d.extras, {
                            name: "Extra",
                            value: x_k.extravalue
                        }] : [{
                            name: "Extra",
                            value: x_k.extravalue
                        }]
                    }
                })


            data.Kumaşlar
                ?.filter(x_f => x_f.orderId === or_id)
                ?.forEach(x_k => {
                    x_d = {
                        ...x_d,
                        extras: x_d?.extras ? [...x_d.extras, {
                            name: "Kumaş",
                            value: x_k.fabricType
                        }] : [{
                            name: "Kumaş",
                            value: x_k.fabricType
                        }]
                    }
                })

            data.Metaller
                ?.filter(x_f => x_f.orderId === or_id)
                ?.forEach(x_m => {
                    x_d = {
                        ...x_d,
                        extras: x_d?.extras ? [...x_d.extras, {
                            name: "Metal",
                            value: x_m.metalType
                        }] : [{
                            name: "Metal",
                            value: x_m.metalType
                        }]
                    }
                })

            data.Renkler
                .filter(x_f => x_f.orderId === or_id)
                .forEach(x_m => {
                    x_d = {
                        ...x_d,
                        extras: x_d?.extras ? [...x_d.extras, {
                            name: "Renk",
                            value: x_m.colourHex
                        }] : [{
                            name: "Renk",
                            value: x_m.colourHex
                        }]
                    }
                })

            data.Ölçüler
                .filter(x_f => x_f.orderId === or_id)
                .forEach(x_m => {
                    const formated = x_m.firstValue + x_m.unit + x_m.secondValue

                    x_d = {
                        ...x_d,
                        extras: x_d?.extras ? [...x_d.extras, {
                            name: "Ölçü",
                            value: formated
                        }] : [{
                            name: "Ölçü",
                            value: formated
                        }]
                    }
                })

            res.products.push(x_d);
        });

        return res;
    }

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: `
        @page {
            margin: 5%;
        }
        `,

    })

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("uk-UA", {
            currency: "UAH",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const calculateTotals = (taxRate, products) => {
        let total = 0;
        let tax = 0;

        products.forEach(product => {
            total += product.totalPrice
        });

        tax = total * (taxRate / 100);

        const grandTotal = total + tax;

        return {
            total: formatCurrency(total),
            tax: formatCurrency(tax),
            grandTotal: formatCurrency(grandTotal),
        };
    };

    const details = filterDataByOrderId()
    const total = calculateTotals(16, details.products)

    return <div className="flex flex-col w-fit h-fit gap-6 relative">
        <button
            className="px-8 py-2 fixed top-8 right-8 bg-green-500 text-white font-bold rounded-md hover:opacity-75 transition-all duration-200 active:bg-green-400"
            onClick={handlePrint}>
            Print Invoice
        </button>

        <div ref={printRef} className="a4">

            {/* Header */}
            <header className="flex items-start justify-end mb-6">
                <Image src="/logo.png" width={200} height={200} alt="" className="mr-auto"/>

                <div className="flex flex-col gap-1">
                    <span className="text-[#363B46] text-[19.125pt] font-bold">Yusuf</span>
                    <span className="text-[13.5pt] text-[#647680] font-bold">552 448 3327</span>
                    <span className="text-[13.5pt] text-[#647680] font-bold">yyilidz518@gmail.com</span>
                    <span className="text-[13.5pt] text-[#647680] font-bold">Siteler mah. 1346 sokak</span>
                </div>
            </header>


            <table className="w-full break-inside-auto">

                <thead className="h-[50px] w-full bg-[#FFC90B]">
                <tr>
                    <th>
                         <span
                             className="text-[10pt] text-[#363B46] font-bold">{langs.invoice[selectedLang]}#</span>
                    </th>
                    <th>
                        <span className="text-[10pt] text-[#000] font-bold">45489</span>
                    </th>
                    <th>
                        <div className="flex items-center justify-around">
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className="text-[10pt] text-[#363B46] font-bold">{langs.teklifNo[selectedLang]}:</span>
                                <span className="text-[10pt] text-[#000] font-bold">{details.order_no}</span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className="text-[10pt] text-[#363B46] font-bold">{langs.date[selectedLang]}:</span>
                                <span
                                    className="text-[10pt] text-[#000] font-bold">12 / 04 / 2023</span>
                            </div>
                        </div>
                    </th>
                    <th/>
                    <th/>
                    <th>
                    </th>
                </tr>
                </thead>

                <thead className="bg-[#363B46] [&_tr_th]:text-center [&_tr_th]: [&_tr_th]:text-white">
                <tr>
                    <th className="px-1 w-fit !font-serif">{langs.order[selectedLang]}</th>
                    <th className="px-1 w-min !font-serif">{langs.image[selectedLang]}</th>
                    <th className="max-h-[105px] !font-serif">{langs.productFeatures[selectedLang]}</th>
                    <th className="!w-fit !font-serif">{langs.price[selectedLang]}</th>
                    <th className="!w-fit !font-serif">{langs.quantity[selectedLang]}</th>
                    <th className="!w-fit !font-serif">{langs.total[selectedLang]}</th>
                </tr>
                </thead>
                <tbody className="[&_tr_td]:p-[6px] [&_tr_td]:text-center [&_tr_th]:text-[#363B46]">
                {details?.products?.map((product, idx) => (
                    <tr key={idx} className="even:bg-[#F2F2F2] bg-white break-inside-avoid">
                        <td className="border-l-2 border-r-2 border-b-2 border-dashed border-[#363B46] text-[13.5pt] text-[#363B46] font-bold">{idx + 1}</td>
                        <td className="border-r-2 border-b-2 border-dashed border-[#363B46]">
                            {product?.image ?
                                <Image src={product?.image} height={75} alt="" className="object-contain m-auto"/> :
                                <div>Not Found</div>}
                        </td>
                        <td className="border-r-2 border-b-2 border-dashed border-[#363B46] overflow-hidden">
                            <div className="!max-h-[99px] overflow-hidden gap-2 flex flex-wrap">
                                <span className="px-2.5 py-1 bg-green-600 text-[9pt] text-white rounded-full w-fit">
                                {product.name}
                            </span>


                                <span
                                    className="px-2.5 py-1 bg-yellow-500 text-[9pt] text-white rounded-full w-fit">
                                {product.info}
                            </span>

                                {
                                    product?.Extralar?.map(feature, index => <div
                                    key={index}
                                        className="px-2 py-1 bg-[#363B46] flex gap-1 [&_span]:text-white rounded-full [&_span]:text-[10pt] items-center">
                                        <span>{feature.value}</span>
                                    </div>)
                                }

                                {
                                    product.note && product.note !== "" && <div
                                        className="px-2 py-1 bg-slate-600 flex gap-1 [&_span]:text-white rounded-md [&_span]:text-[10pt] items-center w-full">
                                        <span>{product.note}</span>
                                    </div>
                                }
                            </div>
                        </td>
                        <td className="border-r-2 border-b-2 border-dashed border-[#363B46]">{formatCurrency(product.price)} грн</td>
                        <td className="border-r-2 border-b-2 border-dashed border-[#363B46]">{product.quantity} грн</td>
                        <td className="border-r-2 border-b-2 border-dashed border-[#363B46]">{formatCurrency((product.quantity * product.price))} грн</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Footer */}
            <footer className="flex justify-between">
                <div className="mt-[24px] flex flex-col h-full">
                    <span className="text-[#363B46] text-[15pt] font-bold">{langs.firmaBilgileri[selectedLang]}</span>
                    <span className="text-[10pt] text-[#647680] font-bold">Фізична особа-підприємець Дурал Онур код за ЄДРПОУ 2896224270 </span>
                    <span className="text-[10pt] text-[#647680] font-bold">UA043052990000026008040126820, Банк АТ КБ "ПРИВАТБАНК", МФО 305299 </span>
                    <span className="text-[10pt] text-[#647680] font-bold">Україна, 76006, Івано-Франківська обл., м.Івано-Франківськ, вул.Вовчинецька, будинок № 200, кв.7</span>
                </div>

                <div className="flex flex-col items-end gap-2 mt-[24px]">
                    <div className="flex items-center gap-6 px-1.5 w-[300px]">
                        <span className="text-[#363B46] text-[13pt] font-bold">{langs.total[selectedLang]} :</span>
                        <p className="ml-auto text-[#363B46] text-[12pt] font-bold">{total.total} грн</p>
                    </div>

                    <div className="flex items-center gap-6 px-1.5 w-[300px]">
                        <span className="text-[#363B46] text-[13pt] font-bold">{langs.vergi[selectedLang]} :</span>
                        <p className="ml-auto text-[#363B46] text-[12pt] font-bold">{total.tax} грн</p>
                    </div>

                    <div className="flex items-center gap-6 w-[300px] bg-[#FFC90B] p-1.5 rounded-sm">
                        <span
                            className="text-[#363B46] text-[13pt] font-bold">{langs.genelToplam[selectedLang]} :</span>
                        <p className="ml-auto text-[#363B46] text-[12pt] font-bold">{total.grandTotal} грн</p>
                    </div>
                </div>
            </footer>
        </div>
    </div>
}

export default Invoice