/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import glob from 'npm:fast-glob@3.2.12'
import { Project } from 'https://deno.land/x/ts_morph/mod.ts'
import { parse, compileScript } from 'npm:@vue/compiler-sfc'
import path from 'npm:path'

const TARGET_DIR = 'lib'
const TARGET_FILE_NAME = `${
  JSON.parse(await Deno.readTextFile('./package.json')).name
}.d.ts`
const TARGET_FILE = `./${TARGET_DIR}/${TARGET_FILE_NAME}`
const CONFIG_PATH = await Deno.realPath('./tsconfig.json')

;(async () => {
  const project = new Project({
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      allowJs: true,
      outDir: TARGET_DIR,
    },
    tsConfigFilePath: CONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })

  const files = await glob(['src/**/*.vue', 'src/types/waveform.ts'])
  const sourceFiles = []

  let index = 1
  await Promise.all(
    files.map(async (file) => {
      if (/\.vue$/.test(file)) {
        const sfc = parse(await Deno.readTextFile(file))
        const { scriptSetup } = sfc.descriptor

        if (scriptSetup) {
          let content = ''
          const compiled = compileScript(sfc.descriptor, {
            id: `${index++}`,
          })
          content += compiled.content
          sourceFiles.push(project.createSourceFile(file + '.ts', content))
        }
      } else sourceFiles.push(project.addSourceFileAtPath(file))
    })
  )

  await project.emitToMemory({ emitOnlyDtsFiles: true })

  for (const sourceFile of sourceFiles) {
    const emitOutput = sourceFile.getEmitOutput()
    for (const outputFile of emitOutput.getOutputFiles()) {
      const filePath = outputFile.getFilePath()
      await Deno.mkdir(path.dirname(filePath), { recursive: true })
      await Deno.writeTextFile(filePath, outputFile.getText())
    }
  }
})()
