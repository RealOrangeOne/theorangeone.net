BASEDIR=$(PWD)
NODE_BIN=$(BASEDIR)/node_modules/.bin

STATIC_SRC=$(BASEDIR)/static/src
STATIC_BUILD=$(BASEDIR)/static/build
OUTPUT_DIR=$(BASEDIR)/public


release: build
	$(NODE_BIN)/speedpack $(OUTPUT_DIR) -o $(OUTPUT_DIR)


build: install
	rm -rf $(OUTPUT_DIR)
	rm -rf $(STATIC_BUILD)
	mkdir -p $(STATIC_BUILD)/js $(STATIC_BUILD)/css
	hugo gen chromastyles --style=monokai > $(STATIC_SRC)/scss/highlight.css
	$(NODE_BIN)/browserify $(STATIC_SRC)/js/index.js -o $(STATIC_BUILD)/js/app.js
	$(NODE_BIN)/node-sass $(STATIC_SRC)/scss/style.scss $(STATIC_BUILD)/css/style.css --source-map-embed
	cp -r $(BASEDIR)/node_modules/lightgallery/dist/fonts $(STATIC_BUILD)
	cp -r $(STATIC_SRC)/img $(STATIC_BUILD)/img
	@hugo -vDEF --stepAnalysis --gc
	mkdir -p $(OUTPUT_DIR)/.well-known/
	cp $(BASEDIR)/static/keybase.txt $(OUTPUT_DIR)/keybase.txt
	cp $(BASEDIR)/static/security.txt $(OUTPUT_DIR)/.well-known/security.txt

server: build
	hugo server --noHTTPCache --disableFastRender --gc


clean:
	rm -rf $(STATIC_BUILD)
	rm -rf $(OUTPUT_DIR)
	rm -rf $(BASEDIR)/node_modules


install: node_modules
	@hugo version

node_modules:
	npm install


test:
	$(NODE_BIN)/sass-lint -vqc .sass-lint.yml
	$(NODE_BIN)/eslint $(STATIC_SRC)/js
	$(NODE_BIN)/yamllint data/*.yml
	$(NODE_BIN)/yamllint config.yml
	$(NODE_BIN)/mdspell --en-gb -ranx 'content/**/*.md'


.PHONY: build clean install test
