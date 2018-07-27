# Upload!
curl \
  -F "status=1" \
  -F "notify=0" \
  -F "ipa=@./release/android.apk" \
  -H "X-HockeyAppToken: $HOCKEY_APP_TOKEN" \
  https://rink.hockeyapp.net/api/2/apps/upload