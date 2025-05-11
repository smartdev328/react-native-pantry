import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function PageHeader({ title }: { title: string }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <View>
        <Text style={styles.headerBold}>{title}</Text>
      </View>
      <View style={styles.divider}></View>
    </View>
  );
}

export default PageHeader;

const styles = StyleSheet.create({
  headerBold: {
    fontSize: 40,
    lineHeight: 50,
    fontFamily: "AGaramondPro-BoldItalic",
    color: "#54634B",
  },
  divider: {
    height: 15,
    width: "100%",
    backgroundColor: "#54634B",
    marginTop: 5,
  },
});
