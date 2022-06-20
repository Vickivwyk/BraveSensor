sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -c 'CREATE EXTENSION IF NOT EXISTS "pgcrypto"'
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/001-setup.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/002-hypertable.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/003-locations_add_columns_set_defaults.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/004-fallbackphone.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/005-human_read_location.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/006-sessions-alertReason.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/007-rename_location_human.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/008-drop_unused_tables.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/009-add-particlecoreid-to-locations.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/010-rename-waiting-for-response.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/011-add-radar-type-to-locations.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/012-rename-heartbeat-alert-columns.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/013-update-locations-table-for-forms.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/014-alterfallbackphonenumbertobeanarray.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/015-add-api-key-to-locations.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/016-alterheatbeackphonenumbertobeanarray.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/017-add-is-active-to-locations.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/018-refactor-sessions.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/019-change-alert-reason-values.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/020-add-responded-at-to-sessions.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/021-add-client-from-phone-number.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/022-add-siren-particle-id.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/023-add-responder-push-id.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/024-add-sent-low-battery-alert-at-to-locations.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/025-add-notifications.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/026-add-sent-vitals-alert-at.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/027-add-location-created-and-updated-dates.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/028-refactor-clients.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/029-drop-location-radartype.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/030-add-sensor-vitals.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/031-add-session-and-sensors-vitals-indices.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/032-add-sensor-vitals-cache.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/033-remove-siren.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/034-alter-session-schema.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/035-add-session-responded-by-phone-number.sql
sudo PGPASSWORD=$PG_PASSWORD psql -U $PG_USER -h $PG_HOST -p $PG_PORT -d $PG_DATABASE --set=sslmode=require -f ./db/036-alterresponderphonenumberstobeanarray.sql
