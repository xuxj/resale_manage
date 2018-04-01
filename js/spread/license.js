if (typeof GC === 'undefined') {
	throw new Error('需引先引进SpreadJs包');
}

var SpreadJs = {
	productKey: '688251263947754#A06rEiojIh94QiwiI4UzN7QTOzYjMxUjM8gjNiojIklkI1pjIEJCLi4TPRJVU5YDWnBFNitEe5E5QPhTNKJFU8ZVZ6UkZDpmd5I5ctt6cOVHcwtEd8YkQSRkT8N5Y0lWSFZlcGFFeroneHZzStJ5UwtmeSVkY5xWWBJFREFHS55mI0IyUiwCOyMDO5UzMxMTM0IicfJye&Qf35VfiEzRwEkI0IyQiwiIwEjL6ByUKBCZhVmcwNlI0IiTis7W0ICZyBlIsISNyETMyADIyIjMwcTMwIjI0ICdyNkIsISbvNmL4Z6bz9Wa7NXezxSbvNmLul6dzl7ciojIz5GRiwiI8+Y9sWY9QmZ0Jyp93uL9hKI06uL9v6L00yp9X009h0K0Qqr9dCo9Cib9z6ZYx'
};

try {
	GC.Spread.Views.LicenseKey = SpreadJs.productKey;
} catch (o) {}

try {
	GC.Spread.Sheets.LicenseKey = SpreadJs.productKey;
} catch (o) {}
