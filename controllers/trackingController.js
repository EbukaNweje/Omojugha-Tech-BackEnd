
const axios = require('axios');

// Function to fetch order status from the shipping service
async function getOrderStatus(orderId) {
    try {
        // Make a GET request to the shipping service's API endpoint
        const response = await axios.get(`https://shipping-service.com/api/orders/${orderId}`);

        // Check if the request was successful
        if (response.status === 200) {
            // Extract order status from the response data
            const orderStatus = response.data.status;
            return orderStatus;
        } else {
            throw new Error('Failed to fetch order status');
        }
    } catch (error) {
        console.error('Error fetching order status:', error);
        throw error; // Propagate the error to the caller
    }
}

// Example usage:
const orderId = '123456789'; // Replace with the actual order ID
getOrderStatus(orderId)
    .then(status => {
        console.log('Order status:', status);
    })
    .catch(error => {
        console.error('Failed to fetch order status:', error);
    });
