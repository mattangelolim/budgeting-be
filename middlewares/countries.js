const countries = {
    "USD": { "name": "United States", "code": "US" },
    "AED": { "name": "United Arab Emirates", "code": "AE" },
    "AFN": { "name": "Afghanistan", "code": "AF" },
    "ALL": { "name": "Albania", "code": "AL" },
    "AMD": { "name": "Armenia", "code": "AM" },
    "ANG": { "name": "Netherlands Antilles", "code": "AN" },
    "AOA": { "name": "Angola", "code": "AO" },
    "ARS": { "name": "Argentina", "code": "AR" },
    "AUD": { "name": "Australia", "code": "AU" },
    "AWG": { "name": "Aruba", "code": "AW" },
    "AZN": { "name": "Azerbaijan", "code": "AZ" },
    "BAM": { "name": "Bosnia and Herzegovina", "code": "BA" },
    "BBD": { "name": "Barbados", "code": "BB" },
    "BDT": { "name": "Bangladesh", "code": "BD" },
    "BGN": { "name": "Bulgaria", "code": "BG" },
    "BHD": { "name": "Bahrain", "code": "BH" },
    "BIF": { "name": "Burundi", "code": "BI" },
    "BMD": { "name": "Bermuda", "code": "BM" },
    "BND": { "name": "Brunei", "code": "BN" },
    "BOB": { "name": "Bolivia", "code": "BO" },
    "BRL": { "name": "Brazil", "code": "BR" },
    "BSD": { "name": "Bahamas", "code": "BS" },
    "BTN": { "name": "Bhutan", "code": "BT" },
    "BWP": { "name": "Botswana", "code": "BW" },
    "BYN": { "name": "Belarus", "code": "BY" },
    "BZD": { "name": "Belize", "code": "BZ" },
    "CAD": { "name": "Canada", "code": "CA" },
    "CDF": { "name": "Congo (Democratic Republic)", "code": "CD" },
    "CHF": { "name": "Switzerland", "code": "CH" },
    "CLP": { "name": "Chile", "code": "CL" },
    "CNY": { "name": "China", "code": "CN" },
    "COP": { "name": "Colombia", "code": "CO" },
    "CRC": { "name": "Costa Rica", "code": "CR" },
    "CUP": { "name": "Cuba", "code": "CU" },
    "CVE": { "name": "Cape Verde", "code": "CV" },
    "CZK": { "name": "Czech Republic", "code": "CZ" },
    "DJF": { "name": "Djibouti", "code": "DJ" },
    "DKK": { "name": "Denmark", "code": "DK" },
    "DOP": { "name": "Dominican Republic", "code": "DO" },
    "DZD": { "name": "Algeria", "code": "DZ" },
    "EGP": { "name": "Egypt", "code": "EG" },
    "ERN": { "name": "Eritrea", "code": "ER" },
    "ETB": { "name": "Ethiopia", "code": "ET" },
    "EUR": { "name": "Eurozone", "code": "EU" },
    "FJD": { "name": "Fiji", "code": "FJ" },
    "FKP": { "name": "Falkland Islands", "code": "FK" },
    "FOK": { "name": "Faroe Islands", "code": "FO" },
    "GBP": { "name": "United Kingdom", "code": "GB" },
    "GEL": { "name": "Georgia", "code": "GE" },
    "GGP": { "name": "Guernsey", "code": "GG" },
    "GHS": { "name": "Ghana", "code": "GH" },
    "GIP": { "name": "Gibraltar", "code": "GI" },
    "GMD": { "name": "Gambia", "code": "GM" },
    "GNF": { "name": "Guinea", "code": "GN" },
    "GTQ": { "name": "Guatemala", "code": "GT" },
    "GYD": { "name": "Guyana", "code": "GY" },
    "HKD": { "name": "Hong Kong", "code": "HK" },
    "HNL": { "name": "Honduras", "code": "HN" },
    "HRK": { "name": "Croatia", "code": "HR" },
    "HTG": { "name": "Haiti", "code": "HT" },
    "HUF": { "name": "Hungary", "code": "HU" },
    "IDR": { "name": "Indonesia", "code": "ID" },
    "ILS": { "name": "Israel", "code": "IL" },
    "IMP": { "name": "Isle of Man", "code": "IM" },
    "INR": { "name": "India", "code": "IN" },
    "IQD": { "name": "Iraq", "code": "IQ" },
    "IRR": { "name": "Iran", "code": "IR" },
    "ISK": { "name": "Iceland", "code": "IS" },
    "JEP": { "name": "Jersey", "code": "JE" },
    "JMD": { "name": "Jamaica", "code": "JM" },
    "JOD": { "name": "Jordan", "code": "JO" },
    "JPY": { "name": "Japan", "code": "JP" },
    "KES": { "name": "Kenya", "code": "KE" },
    "KGS": { "name": "Kyrgyzstan", "code": "KG" },
    "KHR": { "name": "Cambodia", "code": "KH" },
    "KID": { "name": "Kiribati", "code": "KI" },
    "KMF": { "name": "Comoros", "code": "KM" },
    "KRW": { "name": "South Korea", "code": "KR" },
    "KWD": { "name": "Kuwait", "code": "KW" },
    "KYD": { "name": "Cayman Islands", "code": "KY" },
    "KZT": { "name": "Kazakhstan", "code": "KZ" },
    "LAK": { "name": "Laos", "code": "LA" },
    "LBP": { "name": "Lebanon", "code": "LB" },
    "LKR": { "name": "Sri Lanka", "code": "LK" },
    "LRD": { "name": "Liberia", "code": "LR" },
    "LSL": { "name": "Lesotho", "code": "LS" },
    "LYD": { "name": "Libya", "code": "LY" },
    "MAD": { "name": "Morocco", "code": "MA" },
    "MDL": { "name": "Moldova", "code": "MD" },
    "MGA": { "name": "Madagascar", "code": "MG" },
    "MMK": { "name": "Myanmar", "code": "MM" },
    "MNT": { "name": "Mongolia", "code": "MN" },
    "MOP": { "name": "Macau", "code": "MO" },
    "MRU": { "name": "Mauritania", "code": "MR" },
    "MUR": { "name": "Mauritius", "code": "MU" },
    "MVR": { "name": "Maldives", "code": "MV" },
    "MWK": { "name": "Malawi", "code": "MW" },
    "MXN": { "name": "Mexico", "code": "MX" },
    "MYR": { "name": "Malaysia", "code": "MY" },
    "MZN": { "name": "Mozambique", "code": "MZ" },
    "NAD": { "name": "Namibia", "code": "NA" },
    "NGN": { "name": "Nigeria", "code": "NG" },
    "NIO": { "name": "Nicaragua", "code": "NI" },
    "NOK": { "name": "Norway", "code": "NO" },
    "NPR": { "name": "Nepal", "code": "NP" },
    "NZD": { "name": "New Zealand", "code": "NZ" },
    "OMR": { "name": "Oman", "code": "OM" },
    "PAB": { "name": "Panama", "code": "PA" },
    "PEN": { "name": "Peru", "code": "PE" },
    "PGK": { "name": "Papua New Guinea", "code": "PG" },
    "PHP": { "name": "Philippines", "code": "PH" },
    "PKR": { "name": "Pakistan", "code": "PK" },
    "PLN": { "name": "Poland", "code": "PL" },
    "PYG": { "name": "Paraguay", "code": "PY" },
    "QAR": { "name": "Qatar", "code": "QA" },
    "RON": { "name": "Romania", "code": "RO" },
    "RSD": { "name": "Serbia", "code": "RS" },
    "RUB": { "name": "Russia", "code": "RU" },
    "RWF": { "name": "Rwanda", "code": "RW" },
    "SAR": { "name": "Saudi Arabia", "code": "SA" },
    "SBD": { "name": "Solomon Islands", "code": "SB" },
    "SCR": { "name": "Seychelles", "code": "SC" },
    "SDG": { "name": "Sudan", "code": "SD" },
    "SEK": { "name": "Sweden", "code": "SE" },
    "SGD": { "name": "Singapore", "code": "SG" },
    "SHP": { "name": "Saint Helena", "code": "SH" },
    "SLE": { "name": "Sierra Leone", "code": "SL" },
    "SLL": { "name": "Sierra Leone", "code": "SL" },
    "SOS": { "name": "Somalia", "code": "SO" },
    "SRD": { "name": "Suriname", "code": "SR" },
    "SSP": { "name": "South Sudan", "code": "SS" },
    "STN": { "name": "São Tomé and Príncipe", "code": "ST" },
    "SYP": { "name": "Syria", "code": "SY" },
    "SZL": { "name": "Eswatini", "code": "SZ" },
    "THB": { "name": "Thailand", "code": "TH" },
    "TJS": { "name": "Tajikistan", "code": "TJ" },
    "TMT": { "name": "Turkmenistan", "code": "TM" },
    "TND": { "name": "Tunisia", "code": "TN" },
    "TOP": { "name": "Tonga", "code": "TO" },
    "TRY": { "name": "Turkey", "code": "TR" },
    "TTD": { "name": "Trinidad and Tobago", "code": "TT" },
    "TVD": { "name": "Tuvalu", "code": "TV" },
    "TWD": { "name": "Taiwan", "code": "TW" },
    "TZS": { "name": "Tanzania", "code": "TZ" },
    "UAH": { "name": "Ukraine", "code": "UA" },
    "UGX": { "name": "Uganda", "code": "UG" },
    "UYU": { "name": "Uruguay", "code": "UY" },
    "UZS": { "name": "Uzbekistan", "code": "UZ" },
    "VES": { "name": "Venezuela", "code": "VE" },
    "VND": { "name": "Vietnam", "code": "VN" },
    "VUV": { "name": "Vanuatu", "code": "VU" },
    "WST": { "name": "Samoa", "code": "WS" },
    "XAF": { "name": "Central African CFA Franc", "code": "CF" },
    "XCD": { "name": "East Caribbean Dollar", "code": "XC" },
    "XDR": { "name": "IMF Special Drawing Rights", "code": "XD" },
    "XOF": { "name": "West African CFA Franc", "code": "XO" },
    "XPF": { "name": "CFP Franc", "code": "XP" },
    "YER": { "name": "Yemen", "code": "YE" },
    "ZAR": { "name": "South Africa", "code": "ZA" },
    "ZMW": { "name": "Zambia", "code": "ZM" },
    "ZWL": { "name": "Zimbabwe", "code": "ZW" }
};

module.exports = countries;