const mutation = {
  error: false,
  account_id: 2450,
  account_unique_id: "5ffdbd179fa10",
  module: "bni_giro",
  account_name: "PT Herbify Indonesia",
  account_number: "196608208",
  balance: 1000000,
  data: [
    {
      id: 34604095,
      system_date: "2021-01-12 22:42:55",
      transaction_date: "2021-01-12 22:34:16",
      description:
        "TRF/PAY/TOP-UP ECHANNEL | KARTU 5576920112223416 0000000000000000000000  JK | 52196669 341700209",
      type: "CREDIT",
      amount: 25051,
      balance: 1225000,
    },
    {
      id: 34716755,
      system_date: "2021-01-20 15:46:31",
      transaction_date: "2021-01-20 15:45:33",
      description:
        "TRANSFER KE | DESEMBER 2020  MONTHLY CHARGE 0760360589999767 121",
      type: "DEBIT",
      amount: 25000,
      balance: 1200000,
    },
    {
      id: 36323880,
      system_date: "2021-03-26 14:59:30",
      transaction_date: "2021-03-26 14:54:17",
      description:
        "TRF/PAY/TOP-UP ECHANNEL | KARTU 5576920326145417 0000000000000000000000  JK | 52196669 384479794",
      type: "CREDIT",
      amount: 50186,
      balance: 1075000,
    },
    {
      id: 36563609,
      system_date: "2021-04-21 17:12:04",
      transaction_date: "2021-04-21 17:09:23",
      description:
        "TRANSFER KE | MARET 2021 MONTHLY CHARGE 0760360589999767 121",
      type: "DEBIT",
      amount: 25000,
      balance: 1025000,
    },
    {
      id: 36669867,
      system_date: "2021-05-01 04:58:01",
      transaction_date: "2021-04-30 00:00:00",
      description: "BIAYA ADM REK",
      type: "DEBIT",
      amount: 25000,
      balance: 1000000,
    },
  ],
};

module.exports = { mutation };
