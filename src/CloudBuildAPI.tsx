import { getWithAuth, HttpResponse, postWithAuth } from './API';

const UNITY_CLOUD_API_URL = 'https://build-api.cloud.unity3d.com/api/v1';

function getQueueStringFromObject(data: Object) {
    return Object.entries(data).map(([key, value]) => key + '=' + value).join('&');
}

export interface Project {
    name: string;
    projectid: string;
    orgName: string;
    orgid: string;
    guid: string;
    created: string;
    cachedIcon: string;
    serviceFlags?: object;
}

export interface BuildTarget {
    name: string;
    platform: string;
    buildtargetid: string;
    enabled: boolean;
}

export interface BuildRecord {
    build: number,
    buildtargetid: string,
    buildTargetName: string,
    buildGUID: string,
    buildStatus: string,
    cleanBuild: boolean,
    failureDetails: object[],
    canceledBy: string,
    platform: string,
    workspaceSize: number,
    created: string,
    finished: string,
    checkoutStartTime: string,
    checkoutTimeInSeconds: number,
    buildStartTime: string,
    buildTimeInSeconds: number,
    publishStartTime: string,
    publishTimeInSeconds: number,
    totalTimeInSeconds: number,
    unitTestTimeInSeconds: number,
    editModeTestTimeInSeconds: number,
    playModeTestTimeInSeconds: number,
    lastBuiltRevision: string,
    changeset: object[],
    favorited: boolean,
    label: string,
    deleted: boolean,
    headless: object,
    credentialsOutdated: boolean,
    deletedBy: string,
    queuedReason: string,
    cooldownDate: string,
    scmBranch: string,
    unityVersion: string,
    xcodeVersion: string,
    auditChanges: number,
    projectVersion: object,
    projectName: string,
    projectId: string,
    projectGuid: string,
    orgId: string,
    orgFk: string,
    filetoken: string,
    links: object,
    buildReport: object,
    testResults: object,
    error: string,
}

export async function getAllProjects(apiKey: string): Promise<HttpResponse<Project[]>> {
    return await getWithAuth<Project[]>(
        apiKey,
        `${UNITY_CLOUD_API_URL}/projects`
    );
}

export async function getAllBuildTargets(apiKey: string, project: Project): Promise<HttpResponse<BuildTarget[]>> {
    return await getWithAuth<BuildTarget[]>(
        apiKey,
        `${UNITY_CLOUD_API_URL}/orgs/${project.orgid}/projects/${project.projectid}/buildtargets`
    );
}

export async function postCreateNewBuild(apiKey: string, project: Project, target: BuildTarget, cleanBuild: boolean = false): Promise<HttpResponse<BuildRecord[]>> {
    return await postWithAuth<BuildRecord[]>(
        apiKey,
        `${UNITY_CLOUD_API_URL}/orgs/${project.orgid}/projects/${project.projectid}/buildtargets/${target.buildtargetid}/builds`,
        {
            clean: cleanBuild
        }
    );
}

export type BuildRecordOptions = {
    perPage?: number,
    page?: number,
    buildStatus?: 'queued' | 'sentToBuilder' | 'started' | 'restarted' | 'success' | 'failure' | 'canceled ' | 'unknown' | string
    platform?: 'ios' | 'android' | 'webplayer' | 'webgl' | 'standaloneosxintel' | 'standaloneosxintel64' |
    'standaloneosxuniversal' | 'standalonewindows' | 'standalonewindows64' | 'standalonelinux' |
    'standalonelinux64' | 'standalonelinuxuniversal' | 'cloudrenderingstring' | string
    showDeleted?: boolean,
    onlyFavorites?: boolean,
    cleanBuild?: boolean,
}

export async function getBuildRecords(
    apiKey: string,
    project: Project,
    target?: BuildTarget,
    options?: BuildRecordOptions)
    : Promise<HttpResponse<BuildRecord[]>> {

    var buildTarget = target ? target.buildtargetid : '_all'

    var queryString = '?'
    if (options)
        queryString += getQueueStringFromObject(options)

    return await getWithAuth<BuildRecord[]>(
        apiKey,
        `${UNITY_CLOUD_API_URL}/orgs/${project.orgid}/projects/${project.projectid}/buildtargets/${buildTarget}/builds${queryString}`,
    );
}
