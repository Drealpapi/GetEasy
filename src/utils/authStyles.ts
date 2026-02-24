import { StyleSheet } from "react-native";
import { SPACING, FONT_SIZE, COLORS } from "./constants";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xl,
  },
  errorContainer: {
    backgroundColor: COLORS.ERROR + "20",
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.ERROR + "40",
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: COLORS.SUCCESS + "20",
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.SUCCESS + "40",
  },
  successText: {
    color: COLORS.SUCCESS,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.INPUT_BACKGROUND,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: COLORS.TEXT_TERTIARY,
  },
  buttonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  linkText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.md,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderRadius: 4,
    marginRight: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  checkmark: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
});