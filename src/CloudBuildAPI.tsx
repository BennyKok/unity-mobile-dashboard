import { getWithAuth, HttpResponse, postWithAuth } from './API';

const UNITY_CLOUD_API_URL = 'https://build-api.cloud.unity3d.com/api/v1';

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

async function postCreateNewBuild(apiKey: string, project: Project, target: BuildTarget, cleanBuild: boolean = false): Promise<HttpResponse<BuildTarget[]>> {
    return await postWithAuth<BuildTarget[]>(
        apiKey,
        `${UNITY_CLOUD_API_URL}/orgs/${project.orgid}/projects/${project.projectid}/buildtargets/${target.buildtargetid}/builds`,
        {
            clean: cleanBuild
        }
    );
}

// async function getBuilds(apiKey: string, project: Project, target?: BuildTarget, perPage?: number, page?: number): Promise<HttpResponse<BuildTarget[]>> {

//     var buildTarget = target ? target.buildtargetid : '_all'

//     return await getWithAuth<BuildTarget[]>(
//         apiKey,
//         `${UNITY_CLOUD_API_URL}/orgs/${project.orgid}/projects/${project.projectid}/buildtargets/${buildTarget}/builds`,
//         {
//             clean: cleanBuild
//         }
//     );
// }
