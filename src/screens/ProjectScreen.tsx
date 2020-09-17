import React, { useEffect, useState } from 'react';
import { Avatar, Button, ButtonProps, Divider, Icon, Layout, List, ListItem, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, ListRenderItemInfo, ScrollView, View } from 'react-native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { BuildTarget, getAllBuildTargets, Project, getAllProjects } from '../CloudBuildAPI';
import { ExpandableView } from '../components/ExpandableView';
import { loadApiKey } from "../utils/StoreUtils";

type BuildTargetListItem = {
    item: BuildTarget;
};
function BuildTargetListItem(props: BuildTargetListItem) {
    const buildTarget = props.item;
    const navigation = useNavigation();
    return (
        <ListItem
            style={{ backgroundColor: 'transparent' }}
            title={buildTarget.name}
            description={`${buildTarget.buildtargetid} · ${buildTarget.platform} · ${buildTarget.enabled}`}
            accessoryRight={props => <ViewButton onPress={() => {
                // navigation.navigate('ProjectDetails', {
                //   project: project
                // });
            }}>Build</ViewButton>} />
    );
}
type ProjectDetailsScreenRouteProp = StackScreenProps<RootStackParamList, 'ProjectDetails'>;
function ProjectDetailsScreen(props: ProjectDetailsScreenRouteProp) {
    let project = props.route.params.project;

    const [status, setStatus] = useState('Not Loaded');
    const [buildTargets, setBuildTargets] = useState<BuildTarget[]>([]);

    const fetchBuildTargets = async () => {
        //Fetching api
        // return
        setStatus('Loading');

        const apiKey = await loadApiKey();

        try {
            const res = await getAllBuildTargets(apiKey, project);

            if (res.ok) {
                if (res.parsedBody != null) {
                    // console.log(JSON.stringify(res.parsedBody))
                    setBuildTargets(res.parsedBody);
                }
                setStatus('Loaded');
            } else {
                let _status = res.status.toString();
                if (res.parsedBody)
                    _status += ' ' + JSON.stringify(res.parsedBody);
                setStatus(_status);
            }
        } catch (error) {
            setStatus(error);
        }

    };

    useEffect(() => {
        fetchBuildTargets();
    }, []);

    return (
        <>
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <ProjectIconView uri={project.cachedIcon} size='large' />
                </View>
                <ExpandableView title='Details'>
                    <Text category='c1' style={{ fontWeight: 'bold' }}>Id: </Text><Text category='s1'>{project.projectid + '\n'}</Text>
                    <Text category='c1' style={{ fontWeight: 'bold' }}>Organization: </Text><Text category='s1'>{project.orgName + ' · ' + project.orgid + '\n'}</Text>
                    <Text category='c1' style={{ fontWeight: 'bold' }}>GUID: </Text><Text category='s1'>{project.guid + '\n'}</Text>
                    <Text category='c1' style={{ fontWeight: 'bold' }}>Created: </Text><Text category='s1'>{project.created + '\n'}</Text>
                </ExpandableView>

                {status == 'Loaded' && buildTargets.length == 0 ? null :
                    <ExpandableView title='Build Targets' isLoading={status == 'Loading'}>

                        {buildTargets.length > 0 ?
                            <>
                                {buildTargets.slice(0, 3).map((target, index) => (
                                    <BuildTargetListItem key={target.buildtargetid} item={target} />
                                ))}
                            </>
                            : null}
                    </ExpandableView>}

            </ScrollView>

        </>
    );
}
type RootStackParamList = {
    ProjectList: undefined;
    ProjectDetails: { project: Project; };
};
const Stack = createStackNavigator<RootStackParamList>();
export function HomeStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProjectList"
                options={{ title: 'Cloud Projects' }}
                component={ProjectListScreen} />
            <Stack.Screen
                name="ProjectDetails"
                options={({ route }) => ({ title: route.params.project.name })}
                component={ProjectDetailsScreen} />
        </Stack.Navigator>
    );
}
type ProjectIconViewProps = {
    uri: string;
    size?: 'default' | 'large' | string;
};
function ProjectIconView({ uri, size }: ProjectIconViewProps) {
    const [hasIcon, setHasIcon] = useState(uri ? true : false);

    let iconSize1 = 40;
    let iconSize2 = 40;
    let smallIconSize = 30;
    let extraPadding = 0;
    if (size == 'large') {
        extraPadding = 8;

        iconSize1 = 100 - extraPadding * 2;
        iconSize2 = 100;
        smallIconSize = 50;
    }

    return (hasIcon ?
        <View style={{ padding: extraPadding }}><Avatar
            style={{
                width: iconSize1,
                height: iconSize1,
            }}
            source={{
                uri: uri,
            }}
            onError={() => setHasIcon(false)} /></View> : <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: iconSize2,
                height: iconSize2,
            }}><Icon style={{
                width: smallIconSize,
                height: smallIconSize,
            }} fill='#8F9BB3' name='cube-outline' /></View>);
}
function ViewButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            style={{
                paddingVertical: 0
            }}
            appearance='outline'
        >
            {props.children}
        </Button>
    );
}
function ProjectListItem(info: ListRenderItemInfo<Project>) {
    const project = info.item;
    const navigation = useNavigation();
    return (
        <ListItem
            title={project.name}
            description={`${project.projectid} · ${project.orgName}`}
            accessoryRight={props => <ViewButton onPress={() => {
                navigation.navigate('ProjectDetails', {
                    project: project
                });
            }}>View</ViewButton>}
            accessoryLeft={props => (<ProjectIconView uri={project.cachedIcon} />)} />
    );
}
function ProjectListScreen() {
    const [status, setStatus] = useState('Not Loaded');
    const [projects, setProjects] = useState<Project[]>([
        // {
        //   name: "new-projectangrybots",
        //   projectid: "new-projectangrybots",
        //   orgName: "Example Org",
        //   orgid: "example-org",
        //   guid: "2ebef061-6213-4433-8b98-80b2e78c5189",
        //   created: "2015-08-06T19:48:45.259Z",
        //   cachedIcon: "https://unitycloud-build-user-svc-dev-extras-pub.s3.amazonaws.com/example-org/new-projectangrybots/default-webgl-1/icon.png",
        // },
        // {
        //   name: "Example Unity",
        //   projectid: "example-unity",
        //   orgName: "Example Other",
        //   orgid: "example-other",
        //   guid: "94837118-7ee1-4583-bf11-bf33fd4643fb",
        //   created: "2015-10-29T20:32:15.800Z",
        //   cachedIcon: "https://unitycloud-build-user-svc-dev-extras-pub.s3.amazonaws.com/example-org/new-projectangrybots/default-webgl-1/icon.png",
        // }
    ]);

    const fetchProjects = async () => {
        //Fetching api
        // return
        setStatus('Loading');

        const apiKey = await loadApiKey();


        if (!apiKey) {
            setStatus('No API Key');
            return;
        }

        try {
            const res = await getAllProjects(apiKey);
            if (res.ok) {
                if (res.parsedBody != null) {
                    // console.log(JSON.stringify(res.parsedBody))
                    setProjects(res.parsedBody);
                }
                setStatus('Loaded');
            } else {
                let _status = res.status.toString();
                if (res.parsedBody)
                    _status += ' ' + JSON.stringify(res.parsedBody);
                setStatus(_status);
            }
        } catch (error) {
            setStatus(error);
        }

    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        // <FadeInLayout>
        <Layout style={{
            flex: 1,
        }}>
            {status == 'Loaded' ? <List
                data={projects}
                renderItem={(props) => <ProjectListItem {...props} />} /> : <>{status == 'No API Key' ?
                    <View style={{
                        flex: 1
                    }} />
                    :
                    <ActivityIndicator style={{
                        flex: 1,
                        justifyContent: 'center'
                    }} size='large' />}</>}
            <Divider />
            <View style={{
                flexDirection: "row",
                justifyContent: 'space-between',
            }}>
                <Text
                    style={{
                        margin: 8,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        padding: 8,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: 'grey'
                    }}
                    category='c1'>
                    {status}
                </Text>
                <Button
                    // accessoryRight={ViewIcon}
                    status='info'
                    onPress={fetchProjects}
                    appearance='ghost'
                >Fetch Project</Button>
            </View>
        </Layout>
        // </FadeInLayout>
    );
}
