#!/bin/bash

GENERATEDDIR=${GENERATEDDIR:-"../../built"}
IMITSRCDIR=${IMITSRCDIR:-"./imit/src"}
IMITJS=${LUAJS:-"${GENERATEDDIR}/imit.js"}

echo "Building ${IMITJS} with emscripten..."

EMCC=${EMCC:-$(which emcc || true)}
if [ -z $EMCC ]; then
cd ./emsdk
source ./emsdk_env.sh
cd ..
fi
EMCC=${EMCC:-$(which emcc || true)}

EMCCFLAGS=${EMCCFLAGS:-'-O3 -Wno-string-plus-int'}

cd ${IMITSRCDIR}

exported_functions="_main"

reserved_function_pointers=$(wc -w <<<$exported_functions)

"${EMCC}" \
${EMCCFLAGS} \
-s EXPORTED_FUNCTIONS="[${exported_functions}]" \
-s RESERVED_FUNCTION_POINTERS="${reserved_function_pointers}" \
-s EXPORTED_RUNTIME_METHODS='["ccall","cwrap", "addFunction"]' \
-s MODULARIZE=1 \
-s ALLOW_MEMORY_GROWTH=1 \
-s ENVIRONMENT=web \
-s EXPORT_NAME="imit_m" \
-o "${IMITJS}" \
main.cpp

echo "DONE"