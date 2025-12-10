import { StyleSheet } from "react-native";
import { ThemeColors, SPACING, FONT_SIZE } from "../context/ThemeContext";

export const createAuthStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: colors.PRIMARY,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: colors.TEXT_SECONDARY,
    marginBottom: SPACING.xl,
  },
  errorContainer: {
    backgroundColor: colors.ERROR + "20",
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.ERROR + "40",
  },
  errorText: {
    color: colors.ERROR,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: colors.SUCCESS + "20",
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: colors.SUCCESS + "40",
  },
  successText: {
    color: colors.SUCCESS,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: colors.TEXT_PRIMARY,
    backgroundColor: colors.INPUT_BACKGROUND,
  },
  button: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: colors.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: colors.TEXT_TERTIARY,
  },
  buttonText: {
    color: colors.BACKGROUND,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  linkText: {
    color: colors.PRIMARY,
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
    borderColor: colors.BORDER,
    borderRadius: 4,
    marginRight: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
  checkmark: {
    color: colors.BACKGROUND,
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: FONT_SIZE.sm,
    color: colors.TEXT_PRIMARY,
    flex: 1,
  },
});