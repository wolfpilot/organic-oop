/**
 * Pub / sub (Observer) decoupling function
 *
 * Based on Addy Osmani's Publish/Subscribe example
 * https://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
 */
class PubSub {
    /**
     * Constructor
     */
    constructor() {
        this.topics = {};
        this.subID = -1;
    }

    /**
     * Publish event to all subscribers registered to the specified topic
     * @param {String} topic - Topic to be published to
     * @param {*} args - Arguments passed to the subscribers
     * @public
     */
    publish(topic, args) {
        if (!this.topics[topic]) { return; }

        for (const subscriber of this.topics[topic]) {
            subscriber.cb(args);
        }
    }

    /**
     * Unsubscribe listener from topic
     * @param {Number} token - Unique token associated with subscriber
     * @public
     */
    unsubscribe(token) {
        if (!this.topics) { return; }

        const subscriptions = new Map(Object.entries(this.topics));

        // Check existing subscriptions for matching subscriber ID
        subscriptions.forEach((subcribers, topic) => {

            const subID = subcribers.findIndex(sub => sub.token === token);

            if (subID) {
                this.topics[topic].splice(subID, 1);

                return;
            }
        });
    }

    /**
     * Subscribe listener to topic
     * @param {String} topic - Topic to subscribe to
     * @param {Function} cb - Function to be called when new topic is published
     * @returns {Number} - Unique token used to identify the function
     * @public
     */
    subscribe(topic, cb) {
        this.subID += 1;

        const token = this.subID;

        this.topics[topic] = this.topics[topic] || [];

        // Store both token and function
        this.topics[topic].push({
            token: token,
            cb: cb
        });

        return token;
    }
}

// Export as Singleton
export default new PubSub();
