FUNCTION_NAME="HillingdonTaskProcessor"

ENV_VARS="Variables={"

while read -r line || [[ -n "$line" ]]; do
    # Skip empty lines and lines starting with '#'
    if [[ -z "$line" || $line =~ ^# ]]; then
        continue
    fi
    ENV_VARS+="$line,"
done < ".env"

ENV_VARS="${ENV_VARS%,}"

ENV_VARS+="}"

# Execute the AWS CLI command to update the Lambda function configuration
aws lambda update-function-configuration --function-name "$FUNCTION_NAME" --environment "$ENV_VARS"
