import React, { useEffect } from 'react';
import { Button, Icon, IconProps, Input, Layout, Text } from '@ui-kitten/components';
import { CancelIcon, ConfirmIcon } from '../Icons';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { loadApiKey, removeApiKey, setApiKey } from "../utils/StoreUtils";

const SettingsStack = createStackNavigator();
export function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}
function SettingsScreen() {
  const [apiKeyEditing, onChangeTextApiKeyEditing] = React.useState('');
  const [apiKeySaved, onChangeTextApiKeySaved] = React.useState('');
  const [apiKeyVisible, setApiKeyVisible] = React.useState(false);

  useEffect(() => {
    loadApiKey(onChangeTextApiKeySaved);
  });

  const renderIcon = (props: IconProps) => (
    <TouchableWithoutFeedback onPress={() => setApiKeyVisible(!apiKeyVisible)}>
      <Icon {...props} name={!apiKeyVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    // <FadeInLayout>
    <Layout style={{ paddingHorizontal: 10, flex: 1, alignItems: 'flex-start' }}>
      <Text style={{ paddingTop: 8, paddingBottom: 10 }} category='label'>Cloud Build API Key</Text>


      <Input
        style={{ paddingBottom: 4 }}
        // onSubmitEditing={setApiKey}
        placeholder='Cloud Build API Key'
        disabled={apiKeySaved ? true : false}
        secureTextEntry={!apiKeyVisible}
        value={apiKeySaved ? apiKeySaved : apiKeyEditing}
        onChangeText={nextValue => onChangeTextApiKeyEditing(nextValue)}
        accessoryRight={renderIcon} />

      <Layout style={{ flexDirection: "row", alignSelf: "flex-end" }}>



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
              onChangeTextApiKeySaved(apiKeyEditing);
              onChangeTextApiKeyEditing('');
              setApiKeyVisible(false);
            })}
          >
            Set API Key
        </Button>}

      </Layout>
    </Layout>
    //</FadeInLayout>
  );
}
