import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

export default function MultiCategorySelector({
  categories = ['All', 'Beef', 'Fish', 'Pork', 'Poultry'],
  onChange,
}: { onChange?: (selected: string[]) => void; categories?: string[] }) {
  const [selected, setSelected] = useState(['All']);

  const toggleCategory = (cat: string) => {
    let next;
    if (cat === 'All') {
      next = ['All'];
    } else if (selected.includes('All')) {
      next = [cat];
    } else if (selected.includes(cat)) {
      next = selected.filter(c => c !== cat);
      if (next.length === 0) {
        next = ['All'];
      }
    } else {
      next = [...selected, cat];
    }
    setSelected(next);
    onChange?.(next);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(cat => {
        const isSel = selected.includes(cat);
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => toggleCategory(cat)}
            style={styles.item}
            activeOpacity={0.7}
          >
            <Text style={[
                styles.text,
                isSel ? styles.selectedText : styles.unselectedText
              ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  item: {
    alignItems: 'center',
    marginRight: 24,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  selectedText: {
    color: '#54634B', 
    fontFamily: 'Avenir-Black',
  },
  unselectedText: {
    color: '#352329',
    fontFamily: 'Avenir-Regular',
  },
});
