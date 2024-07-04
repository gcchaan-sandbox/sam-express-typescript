sso:
	set +e && \
	aws --profile $(AWS_PROFILE) sts get-caller-identity 1> /dev/null && \
	[[ $? -ne 0 ]] || aws --profile $(AWS_PROFILE) sso login
	set -e

copy: app/run.sh
	@cp app/run.sh .aws-sam/build/App

build:
	sam build --profile $(AWS_PROFILE)
	make copy

deploy:
	make sso
	make build
	sam deploy --profile $(AWS_PROFILE)

logs:
	make sso
	sam logs --stack-name sam-express-typescript --profile $(AWS_PROFILE)

tail:
	make sso
	sam logs --stack-name sam-express-typescript --tail --profile $(AWS_PROFILE)
