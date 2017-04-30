BASEDIR=$(PWD)
NODE_BIN=node_modules/.bin

STATIC_SRC=$(BASEDIR)/static/src
STATIC_BUILD=$(BASEDIR)/static/build
OUTPUT_DIR=$(BASEDIR)/public


build: install
	rm -rf $(OUTPUT_DIR)
	mkdir -p $(STATIC_BUILD)/js $(STATIC_BUILD)/css
	$(NODE_BIN)/browserify $(STATIC_SRC)/js/index.js -o $(STATIC_BUILD)/js/app.js
	$(NODE_BIN)/node-sass $(STATIC_SRC)/scss/style.scss $(STATIC_BUILD)/css/style.css --source-map-embed
	cp -r $(BASEDIR)/node_modules/font-awesome/fonts $(STATIC_BUILD)/fonts
	@hugo -vDEF


clean:
	rm -rf $(STATIC_BUILD)
	rm -rf $(OUTPUT_DIR)
	rm -rf $(BASEDIR)/node_modules


install: node_modules
	@hugo version

node_modules:
	npm install


.PHONY: build clean install
