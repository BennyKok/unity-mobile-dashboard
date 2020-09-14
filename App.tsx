import React, { useEffect, useState } from 'react';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Avatar, BottomNavigation, BottomNavigationTab, Button, ButtonGroup, ButtonProps, Card, Divider, Icon, IconRegistry, Input, Layout, LayoutProps, List, ListItem, Text, TopNavigation } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { NavigationContainer, RouteProp, useNavigation } from '@react-navigation/native';
import { BottomTabBarButtonProps, BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { GestureResponderEvent, ListRenderItemInfo, ScrollView, View, ViewProps } from 'react-native';

import { get, getWithAuth, HttpResponse, loadApiKey, postWithAuth, removeApiKey, setApiKey } from './API';
import { ArrowIcon, CancelIcon, ConfirmIcon, HomeIcon, ProjectIcon, SettingsIcon, ViewIcon } from './Icons';
import { TabButton } from './TabButton';
import { FadeInLayout } from './FadeInLayout';
import { createStackNavigator, StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { NavigationParams } from 'react-navigation';
import Collapsible from 'react-native-collapsible';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Project {
  name: string
  projectid: string
  orgName: string
  orgid: string
  guid: string
  created: string
  cachedIcon: string
  serviceFlags?: object
}

interface BuildTarget {
  name: string
  platform: string
  buildtargetid: string
  enabled: boolean
  // settings: object
  // lastBuilt: object
  // credentials: object
  // builds: object[]
  // links: object
}


const UNITY_CLOUD_API_URL = 'https://build-api.cloud.unity3d.com/api/v1'

// , perPage: number, page: number
// let query = `?per_page=${perPage}&page=${page}`

async function getAllProjects(apiKey: string): Promise<HttpResponse<Project[]>> {
  return await getWithAuth<Project[]>(
    apiKey,
    `${UNITY_CLOUD_API_URL}/projects`
  )
}

async function getAllBuildTargets(apiKey: string, project: Project): Promise<HttpResponse<BuildTarget[]>> {
  return await getWithAuth<BuildTarget[]>(
    apiKey,
    `${UNITY_CLOUD_API_URL}/orgs/${project.orgid}/projects/${project.projectid}/buildtargets`
  )
}

async function postCreateNewBuild(apiKey: string, project: Project, target: BuildTarget, cleanBuild: boolean = false): Promise<HttpResponse<BuildTarget[]>> {
  return await postWithAuth<BuildTarget[]>(
    apiKey,
    `${UNITY_CLOUD_API_URL}/orgs/${project.orgid}/projects/${project.projectid}/buildtargets/${target.buildtargetid}/builds`,
    {
      clean: cleanBuild
    }
  )
}

type ExpandableViewProps = LayoutProps & {
  title: string,
  onPress?: (event: GestureResponderEvent) => void;
}

function ExpandableView(props: ExpandableViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  return (
    <Card onPress={(event) => {
      setIsCollapsed(!isCollapsed)
      if (props.onPress) props.onPress(event)
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* style={{ fontWeight: 'bold' }} */}
        <Text category='s1' >{props.title}</Text>
        <ArrowIcon style={{
          width: 25,
          height: 25,
        }} />
      </View>

      {props.children ?
        <Collapsible collapsed={isCollapsed} style={{ marginTop: 10 }}>
          <Divider style={{ marginBottom: 10 }} />
          {props.children}
        </Collapsible> :
        <></>
      }

    </Card>
  )
}

type BuildTargetListItem = {
  item: BuildTarget
}

function BuildTargetListItem(props: BuildTargetListItem) {
  const buildTarget = props.item
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
      }}>Build</ViewButton>}
    />
  )
}

type ProjectDetailsScreenRouteProp = StackScreenProps<RootStackParamList, 'ProjectDetails'>;

function ProjectDetailsScreen(props: ProjectDetailsScreenRouteProp) {
  let project = props.route.params.project

  const [status, setStatus] = useState('Not Loaded')
  const [buildTargets, setBuildTargets] = useState<BuildTarget[]>([])

  const fetchBuildTargets = async () => {
    //Fetching api
    // return
    setStatus('Loading')

    const apiKey = await loadApiKey()

    const res = await getAllBuildTargets(apiKey, project)

    if (res.ok) {
      if (res.parsedBody != null) {
        // console.log(JSON.stringify(res.parsedBody))
        setBuildTargets(res.parsedBody)
      }
      setStatus('Loaded')
    } else {
      let _status = res.status.toString()
      if (res.parsedBody)
        _status += ' ' + JSON.stringify(res.parsedBody);
      setStatus(_status)
    }
  }

  useEffect(() => {
    fetchBuildTargets()
  }, [])

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

        {buildTargets && buildTargets.length > 0 ?
          <ExpandableView title='Build Targets'>
            {/* <List
              scrollEnabled={false}
              data={buildTargets}
              renderItem={(_props) => <BuildTargetListItem {..._props} />}
            /> */}
            {buildTargets.slice(0, 3).map((target, index) => (
              <BuildTargetListItem key={target.buildtargetid} item={target} />
            ))}
          </ExpandableView> : <></>
        }
      </ScrollView>

    </>
  )
}

type RootStackParamList = {
  ProjectList: undefined;
  ProjectDetails: { project: Project };
};

const Stack = createStackNavigator<RootStackParamList>()

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProjectList"
        options={{ title: 'Cloud Projects' }}
        component={ProjectListScreen}
      />
      <Stack.Screen
        name="ProjectDetails"
        options={
          ({ route }) => ({ title: route.params.project.name })
        }
        component={ProjectDetailsScreen}
      />
    </Stack.Navigator>
  )
}

type ProjectIconViewProps = {
  uri: string
  size?: 'default' | 'large' | string
}

function ProjectIconView({ uri, size }: ProjectIconViewProps) {
  const [hasIcon, setHasIcon] = useState(uri ? true : false)

  let iconSize1 = 40
  let iconSize2 = 40
  let smallIconSize = 30
  let extraPadding = 0
  if (size == 'large') {
    extraPadding = 8

    iconSize1 = 100 - extraPadding * 2
    iconSize2 = 100
    smallIconSize = 50
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
      onError={() => setHasIcon(false)}
    /></View> : <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: iconSize2,
      height: iconSize2,
    }}><Icon style={{
      width: smallIconSize,
      height: smallIconSize,

    }} fill='#8F9BB3' name='cube-outline' /></View>)
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
  const project = info.item
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
      accessoryLeft={props => (<ProjectIconView uri={project.cachedIcon} />)}
    />
  )
}

function ProjectListScreen() {
  const [status, setStatus] = useState('Not Loaded')
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "new-projectangrybots",
      projectid: "new-projectangrybots",
      orgName: "Example Org",
      orgid: "example-org",
      guid: "2ebef061-6213-4433-8b98-80b2e78c5189",
      created: "2015-08-06T19:48:45.259Z",
      cachedIcon: "https://unitycloud-build-user-svc-dev-extras-pub.s3.amazonaws.com/example-org/new-projectangrybots/default-webgl-1/icon.png",
    },
    {
      name: "Example Unity",
      projectid: "example-unity",
      orgName: "Example Other",
      orgid: "example-other",
      guid: "94837118-7ee1-4583-bf11-bf33fd4643fb",
      created: "2015-10-29T20:32:15.800Z",
      cachedIcon: "https://unitycloud-build-user-svc-dev-extras-pub.s3.amazonaws.com/example-org/new-projectangrybots/default-webgl-1/icon.png",
    }
  ])

  const fetchProjects = async () => {
    //Fetching api
    // return
    setStatus('Loading')

    const apiKey = await loadApiKey()

    const res = await getAllProjects(apiKey)

    if (res.ok) {
      if (res.parsedBody != null) {
        // console.log(JSON.stringify(res.parsedBody))
        setProjects(res.parsedBody)
      }
      setStatus('Loaded')
    } else {
      let _status = res.status.toString()
      if (res.parsedBody)
        _status += ' ' + JSON.stringify(res.parsedBody);
      setStatus(_status)
    }
  }


  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <FadeInLayout>
      <Layout style={{
        flex: 1,
      }}>
        <List
          style={{

          }}
          data={projects}
          renderItem={(props) => <ProjectListItem {...props} />}
        />
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
    </FadeInLayout>
  );
}


const SettingsStack = createStackNavigator()

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  )
}

function SettingsScreen() {
  const [apiKeyEditing, onChangeTextApiKeyEditing] = React.useState('');
  const [apiKeySaved, onChangeTextApiKeySaved] = React.useState('');
  const [apiKeyVisible, setApiKeyVisible] = React.useState(false);

  useEffect(() => {
    loadApiKey(onChangeTextApiKeySaved)
  })

  return (
    <FadeInLayout>
      <Layout style={{ paddingHorizontal: 10, flex: 1, alignItems: 'flex-start' }}>
        <Text style={{ paddingTop: 8, paddingBottom: 10 }} category='label'>Cloud Build API Key</Text>
        {/* <Text style={{ paddingBottom: 8, alignSelf: 'flex-start' }} category='c1'>
          {apiKeySaved ? apiKeySaved : "No Saved Key"}
        </Text> */}

        {!apiKeySaved || (apiKeySaved && apiKeyVisible) ?
          <Input
            style={{ paddingBottom: 4 }}
            // onSubmitEditing={setApiKey}
            placeholder='Cloud Build API Key'
            disabled={apiKeySaved ? true : false}
            value={apiKeySaved ? apiKeySaved : apiKeyEditing}
            onChangeText={nextValue => onChangeTextApiKeyEditing(nextValue)}
          /> : <></>
        }

        <Layout style={{ flexDirection: "row", alignSelf: "flex-end" }}>

          {!apiKeySaved ? <></> :
            <Button
              style={{ alignSelf: 'flex-end' }}
              accessoryRight={ViewIcon}
              status='info'
              onPress={() => setApiKeyVisible(!apiKeyVisible)}
              appearance='ghost'
            >
              {apiKeyVisible ? "Hide Key" : "View Key"}
            </Button>
          }

          {apiKeySaved ? <Button
            style={{ alignSelf: 'flex-end' }}
            accessoryRight={CancelIcon}
            status='danger'
            onPress={() => removeApiKey(() => onChangeTextApiKeySaved(''))}
            appearance='outline'
          >
            Remove Key
          </Button> : <Button
              style={{ alignSelf: 'flex-end' }}
              accessoryRight={ConfirmIcon}
              onPress={() => setApiKey(apiKeyEditing, () => {
                onChangeTextApiKeySaved(apiKeyEditing)
                onChangeTextApiKeyEditing('')
                setApiKeyVisible(false)
              })}
            >
              Set API Key
        </Button>}

        </Layout>
      </Layout>
    </FadeInLayout>
  );
}



type CustomBottomTabBarProps = BottomTabBarProps & {
  callback: (value: string) => any
};

function BottomTabBar({ navigation, state, callback }: CustomBottomTabBarProps) {
  const navigate = (index: number) => {
    navigation.navigate(state.routeNames[index]);
    callback(state.routeNames[index]);
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']}>
      <Divider />
      <Layout style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        <TabButton appearance={state.index == 0 ? 'outline' : 'ghost'} accessoryLeft={HomeIcon} onPress={() => { navigate(0) }}>
          {/* Home */}
        </TabButton>
        <TabButton appearance={state.index == 1 ? 'outline' : 'ghost'} accessoryLeft={SettingsIcon} onPress={() => { navigate(1) }}>
          {/* Settings */}
        </TabButton>
      </Layout>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [title, onTitleChange] = React.useState('Home');

  return (
    <>
      {/* <SafeAreaView edges={['right', 'top', 'left']}>
        <TopNavigation
          alignment='center'
          title={title} />
        <Divider />
      </SafeAreaView> */}
      <Tab.Navigator
        tabBar={props => <BottomTabBar
          {...props}
          callback={onTitleChange}
        />}
      >
        <Tab.Screen name='Home' component={HomeStackScreen} />
        <Tab.Screen name='Settings' component={SettingsStackScreen} />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaProvider>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ApplicationProvider>
      <StatusBar style="auto" />
    </>
  );
}