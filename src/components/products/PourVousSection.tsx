import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DotsThreeVertical } from 'phosphor-react-native';

interface PourVousSectionProps {
  marginTop: number;
}

const PourVousSection = memo(({ marginTop }: PourVousSectionProps) => {
  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: marginTop,
      marginBottom: 15,
      paddingHorizontal: 5,
    }}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: 'bold',
          color: '#000',
        }}
      >
        Pour vous
      </Text>
      <TouchableOpacity
        className="flex-row items-center bg-white rounded-md"
        style={{
          paddingVertical: 2,
          paddingHorizontal: 6
        }}
        onPress={() => console.log("Option cliqué")}
      >
        <DotsThreeVertical
          size={20}
          color='#03233A'
          weight='bold'
        />
      </TouchableOpacity>
    </View>
  );
});

PourVousSection.displayName = 'PourVousSection';

export default PourVousSection;
