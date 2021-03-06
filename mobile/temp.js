import React from 'react';
import { TextInput, View, Image, ScrollView, Button, Text, Picker, Keyboard } from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import styles from "./src/styles/main";
import skinsList from './src/databases/skinsList.json'
import skinsAPI from './src/databases/skins.json'

let weaponList = ["AK-47", "AUG", "AWP", "Bayonet", "Bowie Knife", "Butterfly Knife", "CZ75-Auto", "Desert Eagle", "Dual Berettas", 
"Falchion Knife", "FAMAS", "Five-SeveN", "Flip Knife", "G3SG1", "Galil AR", "Glock-18", "Gut Knife", "Huntsman Knife", "Karambit", 
"M249", "M4A1-S", "M4A4", "M9 Bayonet", "MAC-10", "MAG-7", "MP5-SD", "MP7", "MP9", "Navaja Knife", "Negev", "Nova", "P2000", "P250", "P90", "PP-Bizon", 
"R8 Revolver", "Sawed-Off", "SCAR-20", "SG 553", "Shadow Daggers", "SSG 08", "Stiletto Knife", "Talon Knife", "Tec-9", "UMP-45", "Ursus Knife", "USP-S", "XM1014"];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      input: '',
      fetching: false,
      fetched: false,
      missingWeaponSkinsArray: [],
      weapon: "AK-47",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Image style={styles.logo} source={require('./src/images/CS-icon.png')}/>
          <TextInput
            style={styles.input}
            onChangeText={(input) => this.setState({input})}
            value={this.state.input}
            placeholder='Click to paste Steam URL'
            placeholderTextColor='white'
          />
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => this.getJSON(this.state.input)}
              title="Search"
              color='#0ae'
              accessibilityLabel="Get JSON"
            />
          </View>
        </View>
        <View style={styles.weaponPicker}>
          <Text style={styles.selectedWeapon}>
            Selected weapon: 
          </Text>
          <Picker
            hideUnderline
            selectedValue={this.state.weapon}
            style={styles.picker}
            itemStyle={styles.itemStyle}
            onValueChange={(itemValue) =>
              this.setState({weapon: itemValue})
            }>
            <Picker.Item label="AK-47" value="AK-47" />
            <Picker.Item label="AUG" value="AUG" />
          </Picker>
        </View>
        <View style={styles.main}>
          <ScrollView contentContainerStyle={styles.mainContainer}>
            {this.items()}
          </ScrollView>
        </View>
      </View>
    );
  }

  items() {
    let weapon = this.state.weapon;
    let index = 0;
    if (this.state.fetched) {
      return this.state.missingWeaponSkinsArray.map(item => {
        if (item.replace(new RegExp(` \\|(.*)`, "g"), "") === weapon) {
            let skin = item.replace(new RegExp(`${weapon} \\| `, "g"), "");
            if (skinsAPI[weapon][skin] !== undefined) {
              let validImage = "";
              if (skinsAPI[weapon][skin]["Factory New"]["image"] !== "Error") {
                validImage = skinsAPI[weapon][skin]["Factory New"]["image"]
              } else {
                if (skinsAPI[weapon][skin]["Minimal Wear"]["image"] !== "Error") {
                  validImage = skinsAPI[weapon][skin]["Minimal Wear"]["image"]
                } else {
                  if (skinsAPI[weapon][skin]["Field-Tested"]["image"] !== "Error") {
                    validImage = skinsAPI[weapon][skin]["Field-Tested"]["image"]
                  } else {
                    if (skinsAPI[weapon][skin]["Well-Worn"]["image"] !== "Error") {
                      validImage = skinsAPI[weapon][skin]["Well-Worn"]["image"]
                    } else {
                      validImage = skinsAPI[weapon][skin]["Battle-Scarred"]["image"]
                    }
                  }
                }
              }
              index +=1;
              // Add in return below : href={skinsAPI[weapon][skin]["Compare"]["buyLink"]} target="_blank" rel="noopener noreferrer"
              return (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.item}>{skin}</Text>
                  <Image style={styles.itemImage} source={{uri: validImage}}/>
                </View>
              )
            }
            return null
        } else {
          return null
        }
      })
    } else {
      if (this.state.fetching) {
        return (
          <AnimatedEllipsis numberOfDots={3} animationDelay={100} style={{color: '#0ae', fontSize: 72}}/>
        )
      }
    }
  }

  getJSON = async (profileURL) => {
    this.setState({ 
      fetching: true, 
    });
    Keyboard.dismiss()
    const URL = `${profileURL}inventory/json/730/2`;
    try {
      let response = await fetch(
        URL, 
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        });
      let responseJson = await response.json();
      this.getInventory(responseJson);
    } catch (error) {
      console.error(error);
    }
  }

  getInventory(json) {
    let myJSON = [];
    myJSON.push(json);
    let ownedItems = [];
    myJSON.forEach(() => {      
      myJSON.find((item) => {
        for (let items in item.rgDescriptions) {
          let vanillaName = item.rgDescriptions[items].market_hash_name
          ownedItems.push(vanillaName.replace(/\s(\(Minimal Wear\))|\s(\(Field-Tested\))|\s(\(Battle-Scarred\))|\s(\(Well-Worn\))|\s(\(Factory New\))|StatTrak™\s|★\s/g, ''))
        }
        return ownedItems;
      })
    })
    this.getMissingSkins(ownedItems)
  }

  getMissingSkins(ownedItems) {
    let missingSkinsArray = [];
    let itemsListFile = skinsList;
    for(let i = 0; i < itemsListFile.length; i++) {
      if(!(ownedItems.indexOf(itemsListFile[i]) >= 0)) {
        missingSkinsArray.push(itemsListFile[i])
      }
    }
    weaponList.forEach((weapon) => {
      this.getMissingWeaponSkins(missingSkinsArray, weapon)
    }, this);  
  }

  getMissingWeaponSkins(missingSkinsArray, weapon) {
    for(let i = 0; i < missingSkinsArray.length; i++) {
      if(missingSkinsArray[i].indexOf(weapon) >= 0) {    
        this.state.missingWeaponSkinsArray.push(missingSkinsArray[i])      
      }
    }
    this.setState({ 
      fetching: false,
      fetched: true, 
    });
  }
}
