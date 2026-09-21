# Aasoo Macrame

Persian-language e-commerce store (Iran market) selling handmade macrame pieces. A single maker sells their own work; customers order cash-on-delivery without accounts.

## Language

**Product**:
A handmade macrame piece offered for sale, shown on a public catalog page.
_Avoid_: Item (generic), SKU (implies variant-level stock), listing

**Availability**:
Whether a Product is ready to ship now (`in-stock`) or made after the customer orders (`made-to-order`). One-of-a-kind pieces are treated as `in-stock` but are not reserved at cart.
_Avoid_: stock level, inventory count, quantity

**Order**:
A customer's single request to buy one or more Products, placed by a guest and paid on delivery.
_Avoid_: purchase, basket, transaction

**Order Item**:
One Product (with quantity) within an Order, snapshotting the product name, price and image at the time of the Order.
_Avoid_: line item (generic e-commerce), cart line

**Order status**:
The current stage of an Order: `new`, `confirmed`, `shipped`, `delivered`, or `cancelled`. An Order has exactly one status at any time.
_Avoid_: state machine enum, stage (ambiguous)

**COD (Cash on Delivery)**:
Payment collected in cash by the delivery carrier when the Order reaches the customer, not online at checkout. There is no `paid` state; payment happens at delivery.
_Avoid_: online payment, gateway, prepaid

**Guest checkout**:
Ordering without an account; identity is captured as name, phone and address fields on the Order.
_Avoid_: account, customer profile, signup

**Custom order request**:
A prospective customer contacting the maker (via the contact link) to ask for a bespoke piece. Not an Order; there is no custom-order type.
_Avoid_: quote, request-for-quote, commission
