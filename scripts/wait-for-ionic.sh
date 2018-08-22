tail -f ./nohup.out | while read LOGLINE
do
    if [[ "${LOGLINE}" == *"dev server running"* ]]; then
        echo "Started!"
        pkill -P $$ tail
    fi
done