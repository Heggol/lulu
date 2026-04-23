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
        'Vivify',
        'Noodle Extensions'
    ]
    rm.environmentRemoval(map, ['Environment', 'GameCore'])
    map.difficultyInfo.settingsSetter = {
        graphics: {},
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
    prefabs.scene1.instantiate(map, 0)
    prefabs.plane.instantiate(map, {
        beat: 0,
        track: 'petalTrack'
    })    
    new rm.AssignTrackParent(map, {
        beat: 0,
        parentTrack: 'playerTrack',
        childrenTracks: ['petalTrack'],
    })
    rm.animateTrack(map, {
        beat: 0,
        duration: 100,
        track: 'playerTrack',
        animation: {
            localPosition: ["baseHeadPosition"],
            localRotation: ["baseHeadRotation"]
        }
    })
    rm.animateTrack(map, {
        beat: 5,
        duration: 100,
        track: 'petalTrack',
        animation: {
            localRotation: [90, 0,0],
            localPosition: [0, 0, 0]
        }
    })
}

await Promise.all([
    doMap('ExpertPlusStandard')
])

// ----------- { OUTPUT } -----------

pipeline.export({
    outputDirectory: '../OutputMaps/lulu'
})
