source ./docker/.env

export COMPANY_ID=ba7376b6-94a6-4eaa-a6ab-aef7d49a271e

if [ -z "$COMPANY_ID" ]; then
  echo "Error: COMPANY_ID is not set."
  exit 1
fi

if [ -z "$NGROK_DOMAIN" ]; then
  echo "Error: NGROK_DOMAIN is not set."
  exit 1
fi
# This script validates a company in the Sought API.
# It uses the PATCH method to update the validation status of a company.
# The script requires the following environment variables to be set:

echo "Validating company with ID: $COMPANY_ID"

curl --request PATCH https://${NGROK_DOMAIN}/v1/companies/${COMPANY_ID}/validate \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "validation": "ACCEPTED"
  }'