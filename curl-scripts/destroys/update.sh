#!/bin/bash

API="http://localhost:4741"
URL_PATH="/destroys"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "destroy": {
    "target": "'"${TARGET}"'",
    "source": "'"${SOURCE}"'",
    "game": "'"${GAME}"'",
    "turn": "'"${TURN}"'",
    "action": "'"${ACTION}"'"
  }
  }'

echo
