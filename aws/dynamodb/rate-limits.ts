import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const provision = () => {
    const stack = pulumi.getStack();
    const rateLimitTable = new aws.dynamodb.Table(
        `tome-rate-limits-table-${stack}`,
        {
            name: "tome-rate-limits",
            billingMode: "PAY_PER_REQUEST",
            hashKey: "id",
            attributes: [
                {
                    name: "id",
                    type: "S",
                },
            ],
            ttl: {
                enabled: true,
                attributeName: "ttl",
            },
            pointInTimeRecovery: {
                enabled: true,
            },
            serverSideEncryption: {
                enabled: true,
            },
        }
    );

    return rateLimitTable;
};

export default provision;
