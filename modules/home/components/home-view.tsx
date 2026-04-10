import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { useHome } from '../hooks/use-home';
import { HomeItemData } from '../services/responses';

export const HomeView = () => {
  const { metrics, isLoading, refreshData, handleLogout } = useHome();

  const renderMetric = ({ item }: { item: HomeItemData }) => {
    const isPositive = item.trend.startsWith('+');
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={[styles.trendBadge, isPositive ? styles.bgSuccess : styles.bgDanger]}>
            <Text style={[styles.trendText, isPositive ? styles.textSuccess : styles.textDanger]}>
              {item.trend}
            </Text>
          </View>
        </View>
        <Text style={styles.cardValue}>{item.value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Abstract Background Top */}
      <View style={styles.abstractTop} />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Panel Principal</Text>
          <Text style={styles.userName}>Hola, Demo Admin</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isLoading && metrics.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={styles.loadingText}>Cargando resumen...</Text>
          </View>
        ) : (
          <FlatList
            data={metrics}
            keyExtractor={(item) => item.id}
            renderItem={renderMetric}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={isLoading} 
                onRefresh={refreshData}
                tintColor="#f97316"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  abstractTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  logoutBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#9ca3af',
    fontWeight: '500',
    fontSize: 15,
  },
  listContainer: {
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bgSuccess: {
    backgroundColor: '#dcfce7',
  },
  bgDanger: {
    backgroundColor: '#fee2e2',
  },
  trendText: {
    fontSize: 13,
    fontWeight: '700',
  },
  textSuccess: {
    color: '#16a34a',
  },
  textDanger: {
    color: '#ef4444',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  }
});
