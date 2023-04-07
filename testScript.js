$(document).ready(function(){
    let veil = document.getElementById('veil');
    
    let uName = document.getElementById('name');
    let uId = document.getElementById('uid');
    let amount = document.getElementById('amount');
    let emino = document.getElementById('emino');

    let cName = document.getElementById('cName');
    let cId = document.getElementById('cId');
    let cAmount = document.getElementById('cAmount');
    let cEmiNo = document.getElementById('cEmiNo');

    let closeVeil = document.getElementById('closeVeil');
    let submitBtn = document.getElementById('submit');
    let confirmBtn = document.getElementById('confirmBtn');

    var configJson = {
        'tarCall': false,
        'features': {
            'showPGResponseMsg': true,
            'enableAbortResponse': true,
            'enableNewWindowFlow': true,
            'enableExpressPay':true,
            'siDetailsAtMerchantEnd':true,   
            'enableSI':true,
        },
        'consumerData': {
            'deviceId': 'WEBSH2',
            'token': '',
            'returnUrl': 'http://3.144.38.100:3000/response',
            'responseHandler': handleResponse,
            'paymentMode': 'netBanking',
            'merchantLogoUrl': 'https://www.paynimo.com/CompanyDocs/company-logo-md.png',
            'merchantId': '', // T877420
            'currency': 'INR',
            'consumerId': '',
            "consumerMobileNo": "",
            "consumerEmailId": "",
            'txnId': '',
            'items': [{
                'itemId': 'First',
                'amount': '1',
                'comAmt': '0' 
            }],
            'customStyle': {
                'PRIMARY_COLOR_CODE': '#3977b7',
                'SECONDARY_COLOR_CODE': '#FFFFFF',
                'BUTTON_COLOR_CODE_1': '#1969bb',
                'BUTTON_COLOR_CODE_2': '#FFFFFF'
            },
        'accountNo': '',
        'accountHolderName': '',
        'ifscCode': '',
        'accountType': 'Saving',
        'debitStartDate': '',
        'debitEndDate': '',
        'maxAmount': '',
        'amountType': 'M',
        'frequency': ''
        }
    };

    submitBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        let uNameValue = uName.value;
        let uIdValue = uId.value;
        let amountValue = amount.value;
        let eminoValue = emino.value;

        let inputStatus1 = inputCheck();
        let inputStatus2 = inputCheck();
        let inputStatus3 = inputCheck();
        let emiStatus = emiCheck();

        if(inputStatus1 && inputStatus2 && inputStatus3 && emiStatus){

            cName.innerText = uNameValue;
            cId.innerText = uIdValue;
            cAmount.innerText = amountValue;
            cEmiNo.innerText = eminoValue;

            let cNameValue = cName.innerText;
            let cIdValue = cId.innerText;
            let cAmountValue = cAmount.innerText;
            let cEmiNoValue = cEmiNo.value;
        
            $.post(
                "http://3.144.38.100:3000/genTxnId",
                {
                    name : cNameValue,
                    uid : cIdValue,

                },
                function(result){
                    let txnId = result;
                    let merchantId = 'T877420';
                    let totalamount = '1'; 
                    let amountType = 'M';
                    // cIdValue = 'c964636';
                    let plainPass = merchantId + '|' + txnId + '|' + totalamount + '|' + '|' + cIdValue + '|' + '|' + '|' + cStartDateValue + '|' + cEndDateValue + '|' + cAmountValue + '|' + amountType + '|' + cFreqValue + '|' + '|' + '|' + '|' + '|';

                    $.post(
                        "http://3.144.38.100:3000/genHash",
                        {
                            plainPass : [merchantId, txnId, totalamount, cIdValue, cAmountValue,cEmiNoValue]
                        },
                        function(result){
                            // console.log('genHash');
                            let hashVal = result;
                            configJson.consumerData.token = hashVal.toString();
                            configJson.consumerData.consumerId = cIdValue.toString();
                            configJson.consumerData.txnId = txnId.toString();
                            configJson.consumerData.debitStartDate = cStartDateValue.toString();
                            configJson.consumerData.debitEndDate = cEndDateValue.toString();
                            configJson.consumerData.maxAmount = cAmountValue.toString();
                            configJson.consumerData.frequency = cFreqValue.toString();  
                            $.post(
                                "http://3.144.38.100:3000/testRequest",
                                {
                                    data : JSON.stringify({
                                        consumerName : cNameValue,
                                        customerId : cIdValue,
                                        txnId : txnId,
                                        amount : cAmountValue,
                                        frequency : cFreqValue,
                                        debitStartDate : cStartDateValue,
                                        debitEndDate : cEndDateValue
                                    })
                                },
                                function(result){
                                    // console.log(configJson);
                                    veil.style.top = '0';
                                    veil.style.left = '0';
                                }
                            )
                        }
                    )
                }
            )
        }
    })
})

function inputCheck(element, value){
    let errElement = element.nextElementSibling;
    if(value.length == 0){
        errElement.innerText = 'field cannot be empty';
        errElement.style.visibility = 'visible';
        errElement.style.color = 'firebrick';
        return 0;
    }
    else{
        errElement.innerText = 'Err msg';
        errElement.style.visibility = 'hidden';
        return 1;
    }
}

function emiCheck(element, value){
    let errElement = element.nextElementSibling;
}


$(document).ready(function(){

    submitBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        let uNameValue = uName.value;
        let uIdValue = uId.value;
        let amountValue = amount.value;
        let freqValue = 'ADHO';
        let startDateValue = startDate.value;
        let endDateValue = endDate.value;
        let newStartDate = startDateValue.split('-')[2] + '-' + startDateValue.split('-')[1] + '-' + startDateValue.split('-')[0];
        let newEndDate = endDateValue.split('-')[2] + '-' + endDateValue.split('-')[1] + '-' + endDateValue.split('-')[0];

        // console.log(newStartDate);
        // console.log(newEndDate);

        startDateValue = newStartDate;
        endDateValue = newEndDate;

        let inputStatus1 = inputCheck(uName, uNameValue);
        let inputStatus2 = inputCheck(uId, uIdValue);
        let inputStatus3 = inputCheck(amount, amountValue);
        // let inputStatus4 = inputCheck(freq, freqValue);
        let inputStatus5 = inputCheck(startDate, startDateValue);
        let inputStatus6 = inputCheck(endDate, endDateValue);

        if(inputStatus1 && inputStatus2 && inputStatus3 && inputStatus5 && inputStatus6){
            cName.innerText = uNameValue;
            cId.innerText = uIdValue;
            cAmount.innerText = amountValue;
            cFreq.innerText = freqValue;
            cStartDate.innerText = startDateValue;
            cEndDate.innerText = endDateValue;

            let cNameValue = cName.innerText;
            let cIdValue = cId.innerText;
            let cAmountValue = cAmount.innerText;
            let cFreqValue = cFreq.innerText;
            let cStartDateValue = cStartDate.innerText;
            let cEndDateValue = cEndDate.innerText;

            $.post(
                "http://3.144.38.100:3000/genTxnId",
                {
                    name : cNameValue,
                    uid : cIdValue,

                },
                function(result){
                    // console.log('genTxnId');
                    let txnId = result;
                    let merchantId = 'T877420';
                    let totalamount = '1'; 
                    let amountType = 'M';
                    // cIdValue = 'c964636';
                    let plainPass = merchantId + '|' + txnId + '|' + totalamount + '|' + '|' + cIdValue + '|' + '|' + '|' + cStartDateValue + '|' + cEndDateValue + '|' + cAmountValue + '|' + amountType + '|' + cFreqValue + '|' + '|' + '|' + '|' + '|';

                    $.post(
                        "http://3.144.38.100:3000/genHash",
                        {
                            plainPass : plainPass
                        },
                        function(result){
                            // console.log('genHash');
                            let hashVal = result;
                            configJson.consumerData.token = hashVal.toString();
                            configJson.consumerData.consumerId = cIdValue.toString();
                            configJson.consumerData.txnId = txnId.toString();
                            configJson.consumerData.debitStartDate = cStartDateValue.toString();
                            configJson.consumerData.debitEndDate = cEndDateValue.toString();
                            configJson.consumerData.maxAmount = cAmountValue.toString();
                            configJson.consumerData.frequency = cFreqValue.toString();  
                            $.post(
                                "http://3.144.38.100:3000/testRequest",
                                {
                                    data : JSON.stringify({
                                        consumerName : cNameValue,
                                        customerId : cIdValue,
                                        txnId : txnId,
                                        amount : cAmountValue,
                                        frequency : cFreqValue,
                                        debitStartDate : cStartDateValue,
                                        debitEndDate : cEndDateValue
                                    })
                                },
                                function(result){
                                    // console.log(configJson);
                                    veil.style.top = '0';
                                    veil.style.left = '0';
                                }
                            )
                        }
                    )
                }
            )

        }
    })

    confirmBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        
        $.pnCheckout(configJson);
        if(configJson.features.enableNewWindowFlow){
            pnCheckoutShared.openNewWindow();
        }
    })

    closeVeil.addEventListener('click', (e)=>{
        e.preventDefault();
        veil.style.top = '-100%';
        veil.style.left = '0';
    })
    })

    function handleResponse(res) {
        if (typeof res != 'undefined' && typeof res.paymentMethod != 'undefined' && typeof res.paymentMethod.paymentTransaction != 'undefined' && typeof res.paymentMethod.paymentTransaction.statusCode != 'undefined' && res.paymentMethod.paymentTransaction.statusCode == '0300') {
            // success block
        } else if (typeof res != 'undefined' && typeof res.paymentMethod != 'undefined' && typeof res.paymentMethod.paymentTransaction != 'undefined' && typeof res.paymentMethod.paymentTransaction.statusCode != 'undefined' && res.paymentMethod.paymentTransaction.statusCode == '0398') {
            // initiated block
        } else {
            // error block
        }
    };


