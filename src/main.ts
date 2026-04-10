import * as rm from "https://deno.land/x/remapper@4.2.0/src/mod.ts"
import * as bundleInfo from '../bundleinfo.json' with { type: 'json' }

const pipeline = await rm.createPipeline({ bundleInfo })

const bundle = rm.loadBundle(bundleInfo)
const materials = bundle.materials
const prefabs = bundle.prefabs

// ----------- { SCRIPT } -----------

async function doMap(file: rm.DIFFICULTY_NAME) {
    const map = await rm.readDifficultyV3(pipeline, file)
    map.difficultyInfo.requirements = [
        'Chroma',
        'Noodle Extensions',
        'Vivify',
    ]
    rm.environmentRemoval(map, ['Environment', 'GameCore'])
    map.difficultyInfo.settingsSetter = {
        graphics: {
            screenDisplacementEffectsEnabled: true,
        },
        chroma: {
            disableEnvironmentEnhancements: false,
        },
        playerOptions: {
            leftHanded: false,
        },
        colors: {},
        environments: {},
        modifiers: {}
    }
    //rm.setRenderingSettings(map, {})
    prefabs.flowerpedals.instantiate(map, {
        scale: [5, 5, 5],
        track: 'flowerpedals',
        beat: 0,
        position: [-80, 50, 50]
    })
    const sc1 = prefabs.scene1.instantiate(map, 0)
}

await Promise.all([
    doMap('ExpertPlusStandard')
])

// ----------- { OUTPUT } -----------

pipeline.export({
    outputDirectory: '../OutputMaps/lulu'
})
