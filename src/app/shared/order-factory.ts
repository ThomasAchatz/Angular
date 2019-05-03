
import { Order } from './order';

export class OrderFactory {

    static empty(): Order {
        return new Order(null, [], 0,  new Date(), 0, 0, [{order_id: 0, status: '',}], []);
    }

    static fromObject(rawOrder: any): Order {
        return new Order(
            rawOrder.id,
            rawOrder.items,
            rawOrder.user_id,
            typeof(rawOrder.date) === 'string' ?
                new Date(rawOrder.date) : rawOrder.date,
            rawOrder.total_brutto,
            rawOrder.total_netto,
            rawOrder.status,
            rawOrder.user
        );
    }
}