// const url = 'https://api.test.paysafe.com/paymenthub/v1/paymenthandles';
// const options = {
//     method: 'POST',
//     headers: {
//         Simulator: '',
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         Authorization: 'Basic cG1sZS0xMTE4NzQwOkItcWEyLTAtNjdlODkxMjItMC0zMDJjMDIxNDNlYTdlM2I0OTU3ODJkMjUxZmNlYTI4MTg4OGU0Y2UyNDlhMDM0ZGIwMjE0NmY3N2RhMDFmYTlhOGU2ZTIzMjgzODQ0ZDQ4NTBjY2NhMTlmNDYxOQ=='
//     },
//     body: '{"merchantRefNum":"49115d2d54fba7f6a0e8","transactionType":"PAYMENT","threeDs":{"merchantUrl":"https://example.com/example","deviceChannel":"BROWSER","messageCategory":"PAYMENT","transactionIntent":"CHECK_ACCEPTANCE","authenticationPurpose":"PAYMENT_TRANSACTION","requestorChallengePreference":"NO_PREFERENCE","orderItemDetails":{"preOrderItemAvailabilityDate":"2014-01-26","preOrderPurchaseIndicator":"MERCHANDISE_AVAILABLE","reorderItemsIndicator":"FIRST_TIME_ORDER","shippingIndicator":"SHIP_TO_BILLING_ADDRESS"},"purchasedGiftCardDetails":{"amount":1234,"count":2,"currency":"USD"},"userAccountDetails":{"addCardAttemptsForLastDay":1,"changedDate":"2010-01-26","changedRange":"DURING_TRANSACTION","createdDate":"2010-01-26","createdRange":"NO_ACCOUNT","passwordChangedDate":"2012-01-26","passwordChangedRange":"NO_CHANGE","paymentAccountDetails":{"createdRange":"NO_ACCOUNT","createdDate":"2010-01-26"},"shippingDetailsUsage":{"cardHolderNameMatch":true,"initialUsageDate":"2014-01-26","initialUsageRange":"CURRENT_TRANSACTION"},"suspiciousAccountActivity":true,"totalPurchasesSixMonthCount":1,"transactionCountForPreviousDay":1,"transactionCountForPreviousYear":3,"userLogin":{"authenticationMethod":"NO_LOGIN","data":"Some up to 2048 bytes undefined data","time":"2014-01-26T10:32:28Z"}}},"card":{"cardNum":"4000000000001026","cardExpiry":{"month":10,"year":2025},"cvv":"111","holderName":"Dilip","issuingCountry":"US"},"accountId":"1009688230","paymentType":"CARD","amount":500,"currencyCode":"USD","billingDetails":{"nickName":"Home","street":"abcd","city":"defg","state":"AL","country":"US","zip":"94404"},"returnLinks":[{"rel":"default","href":"https://usgaminggamblig.com/payment/return/","method":"GET"},{"rel":"on_completed","href":"https://usgaminggamblig.com/payment/return/success","method":"GET"},{"rel":"on_failed","href":"https://usgaminggamblig.com/payment/return/failed","method":"GET"}]}'
// };

// try {
//     const response = await fetch(url, options);
//     const data = await response.json();
//     console.log(data);
// } catch (error) {
//     console.error(error);
// }