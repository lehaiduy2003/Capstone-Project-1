import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { getValueFor } from "../../utils/secureStore";
import { theme } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";

const CustomerManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const roles = ["admin", "customer", "recycler"];

  // Prepare accounts data with unique identifiers
  const prepareAccountsData = () => {
    const groupedAccounts = accounts.reduce((acc, account) => {
      acc[account.role] = acc[account.role] || [];
      acc[account.role].push(account);
      return acc;
    }, {});

    return Object.entries(groupedAccounts).map(([role, accounts]) => ({
      id: `role-${role}`,
      role,
      accounts: accounts.map((account) => ({
        ...account,
        uniqueId: `${role}-${account._id}`,
      })),
    }));
  };

  const fetchAccounts = async (pageNumber = 1, shouldRefresh = false) => {
    if (shouldRefresh) {
      setLoading(true);
    } else if (!shouldRefresh && pageNumber > 1) {
      setLoadingMore(true);
    }

    setError(null);

    try {
      const accessToken = await getValueFor("accessToken");

      if (!accessToken) {
        throw new Error("Access token not found. Please log in again.");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users?page=${pageNumber}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch accounts.");
      }

      const { data, pagination } = await response.json();

      setHasMore(data.length === ITEMS_PER_PAGE);

      setAccounts((prev) => {
        if (shouldRefresh) return data;

        // Use Map to remove duplicates based on _id
        const accountMap = new Map([
          ...prev.map((account) => [account._id, account]),
          ...data.map((account) => [account._id, account]),
        ]);

        return Array.from(accountMap.values());
      });

      setPage(pageNumber);
    } catch (err) {
      setError(err.message);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts(1, true);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAccounts(1, true);
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore && !refreshing) {
      fetchAccounts(page + 1, false);
    }
  };

  const handleDeleteAccount = async (userId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const accessToken = await getValueFor("accessToken");

            if (!accessToken) {
              throw new Error("No token provided");
            }

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (!response.ok) {
              throw new Error("Failed to delete account");
            }

            onRefresh();
            Alert.alert("Success", "Account deleted successfully");
          } catch (err) {
            Alert.alert("Error", err.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const accessToken = await getValueFor("accessToken");
      const newStatus = currentStatus === "active" ? "blocked" : "active";

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update account status");
      }

      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account._id === userId ? { ...account, status: newStatus } : account
        )
      );

      Alert.alert("Success", `Account status updated to ${newStatus}`);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleEditPress = (account) => {
    setSelectedAccount(account);
    setEditModalVisible(true);
  };

  const renderAccountItem = ({ item }) => {
    if (!item) return null;

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString();
    };

    return (
      <View style={styles.accountItem}>
        <View style={styles.accountHeader}>
          <View style={styles.detailRow}>
            <Text style={styles.labelText}>Name:</Text>
            <Text style={styles.valueText}>{item.name || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.labelText}>ID:</Text>
            <Text style={styles.valueText}>{item._id || "N/A"}</Text>
          </View>

          <View style={styles.statusRoleContainer}>
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === "active" ? theme.colors.success : theme.colors.error,
                  },
                ]}
              >
                {item.status || "N/A"}
              </Text>
            </View>
            <View style={styles.roleContainer}>
              <Text style={styles.roleBadge}>{item.role ? item.role.toUpperCase() : "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.accountDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.info}>{item.email || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.info}>Created: {formatDate(item.createdAt)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.info}>Updated: {formatDate(item.updatedAt)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#666" />
            <Text style={styles.info}>
              Verification: {item.isVerified ? "Verified" : "Not Verified"}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            onPress={() => handleEditPress(item)}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleStatusToggle(item._id, item.status)}
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  item.status === "active" ? theme.colors.warning : theme.colors.success,
              },
            ]}
          >
            <Text style={styles.actionButtonText}>
              {item.status === "active" ? "Block" : "Unblock"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteAccount(item._id)}
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAccountSection = ({ item }) => {
    return (
      <View style={styles.section} key={item.id}>
        <View style={styles.sectionHeader}>
          <Text style={styles.roleHeader}>
            {item.role.charAt(0).toUpperCase() + item.role.slice(1)} Accounts
          </Text>
          <Text style={styles.countBadge}>{item.accounts.length}</Text>
        </View>
        {item.accounts.map((account) => (
          <View key={account.uniqueId} style={styles.accountWrapper}>
            {renderAccountItem({ item: account })}
          </View>
        ))}
      </View>
    );
  };

  const CreateAccountModal = () => {
    const [localFormData, setLocalFormData] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: [""],
      role: "customer",
      status: "active",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
      setLocalFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: [""],
        role: "customer",
        status: "active",
      });
    };

    const handleSubmit = async () => {
      if (isSubmitting) return;

      if (
        !localFormData.email ||
        !localFormData.password ||
        !localFormData.name ||
        !localFormData.phone
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);

      try {
        const accessToken = await getValueFor("accessToken");

        if (!accessToken) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localFormData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create account");
        }

        resetForm();
        setModalVisible(false);
        onRefresh();
        Alert.alert("Success", "Account created successfully");
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          resetForm();
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Create New Account</Text>

              <TextInput
                style={styles.input}
                placeholder="Name *"
                value={localFormData.name}
                onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, name: text }))}
              />

              <TextInput
                style={styles.input}
                placeholder="Email *"
                value={localFormData.email}
                onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password *"
                value={localFormData.password}
                onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, password: text }))}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Phone *"
                value={localFormData.phone}
                onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Address"
                value={localFormData.address[0]}
                onChangeText={(text) =>
                  setLocalFormData((prev) => ({
                    ...prev,
                    address: [text],
                  }))
                }
              />

              <View style={styles.roleSelector}>
                {["customer", "recycler"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      localFormData.role === role && styles.roleButtonActive,
                    ]}
                    onPress={() => setLocalFormData((prev) => ({ ...prev, role: role }))}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        localFormData.role === role && styles.roleButtonTextActive,
                      ]}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.colors.error }]}
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: isSubmitting ? theme.colors.disabled : theme.colors.primary,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.modalButtonText}>
                    {isSubmitting ? "Creating..." : "Create"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const EditAccountModal = () => {
    const [localFormData, setLocalFormData] = useState({
      name: selectedAccount?.name || "",
      email: selectedAccount?.email || "",
      role: selectedAccount?.role || "customer",
    });

    useEffect(() => {
      if (selectedAccount) {
        setLocalFormData({
          name: selectedAccount.name,
          email: selectedAccount.email,
          role: selectedAccount.role,
        });
      }
    }, [selectedAccount]);

    const handleUpdate = async () => {
      try {
        const accessToken = await getValueFor("accessToken");
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/${selectedAccount._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(localFormData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update account");
        }

        Alert.alert("Success", "Account updated successfully");
        setEditModalVisible(false);
        setSelectedAccount(null);
        onRefresh();
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(false);
          setSelectedAccount(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={localFormData.name}
              onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, name: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={localFormData.email}
              onChangeText={(text) => setLocalFormData((prev) => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.roleSelector}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    localFormData.role === role && styles.roleButtonActive,
                  ]}
                  onPress={() => setLocalFormData((prev) => ({ ...prev, role: role }))}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      localFormData.role === role && styles.roleButtonTextActive,
                    ]}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.error }]}
                onPress={() => {
                  setEditModalVisible(false);
                  setSelectedAccount(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleUpdate}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading && !refreshing && accounts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    //  <ScreenWrapper>
    //     <Header title="Account Management" showBackButton />
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Account</Text>
      </TouchableOpacity>

      <FlatList
        data={prepareAccountsData()}
        keyExtractor={(item) => item.id}
        renderItem={renderAccountSection}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={{ padding: 20 }} />
          ) : null
        }
      />

      <CreateAccountModal />
      <EditAccountModal />
    </View>
    //   </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  roleHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    flex: 1,
  },
  countBadge: {
    backgroundColor: theme.colors.primary,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "bold",
  },
  accountItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  accountHeader: {
    flexDirection: "column",
    gap: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  accountDetails: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  labelText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginRight: 8,
  },
  valueText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  statusRoleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  statusContainer: {
    flex: 1,
    marginRight: 8,
  },
  roleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  roleBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 8,
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  roleButtonText: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
  roleButtonTextActive: {
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  accountWrapper: {
    marginBottom: 10,
  },
});

export default CustomerManagement;
